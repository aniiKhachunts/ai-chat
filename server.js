import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import RunwayML from "@runwayml/sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: "20mb" }));

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const AIML_API_KEY = process.env.AIML_API_KEY;
const POLLO_API_KEY = process.env.POLLO_API_KEY;
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const runwayClient = new RunwayML();

app.post("/api/chat", async (req, res) => {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
        return res.status(400).json({ error: "messages array is required" });
    }

    if (!OPENAI_API_KEY) {
        return res.status(500).json({ error: "OPENAI_API_KEY is not set" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const reply =
            data &&
            data.choices &&
            data.choices[0] &&
            data.choices[0].message &&
            data.choices[0].message.content
                ? data.choices[0].message.content
                : "";

        res.json({ reply });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

app.post("/api/veo", async (req, res) => {
    const { prompt, mode, imageBase64, imageMimeType } = req.body;

    if (!prompt || typeof prompt !== "string") {
        return res.status(400).json({ error: "prompt is required" });
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
    }

    try {
        let instances;

        if (mode === "image" && imageBase64) {
            let mimeType = imageMimeType || "image/png";
            let imageBytes = imageBase64;
            const match = /^data:(.*?);base64,(.*)$/.exec(imageBase64);
            if (match) {
                mimeType = imageMimeType || match[1] || "image/png";
                imageBytes = match[2];
            }

            instances = [
                {
                    prompt,
                    image: {
                        imageBytes,
                        mimeType
                    }
                }
            ];
        } else {
            instances = [
                {
                    prompt
                }
            ];
        }

        const startResponse = await fetch(
            `${GEMINI_BASE_URL}/models/veo-3.1-generate-preview:predictLongRunning`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": GEMINI_API_KEY
                },
                body: JSON.stringify({ instances })
            }
        );

        const startData = await startResponse.json();

        if (!startResponse.ok) {
            return res.status(startResponse.status).json(startData);
        }

        const operationName = startData && startData.name ? startData.name : null;

        if (!operationName) {
            return res.status(500).json({ error: "No operation name returned from Veo" });
        }

        let videoUri = null;

        for (let i = 0; i < 12; i++) {
            const statusResponse = await fetch(
                `${GEMINI_BASE_URL}/${operationName}`,
                {
                    headers: {
                        "x-goog-api-key": GEMINI_API_KEY
                    }
                }
            );

            const statusData = await statusResponse.json();

            if (!statusResponse.ok) {
                return res.status(statusResponse.status).json(statusData);
            }

            if (statusData.done) {
                videoUri =
                    statusData &&
                    statusData.response &&
                    statusData.response.generateVideoResponse &&
                    statusData.response.generateVideoResponse.generatedSamples &&
                    statusData.response.generateVideoResponse.generatedSamples[0] &&
                    statusData.response.generateVideoResponse.generatedSamples[0].video &&
                    statusData.response.generateVideoResponse.generatedSamples[0].video.uri
                        ? statusData.response.generateVideoResponse.generatedSamples[0].video.uri
                        : null;
                break;
            }

            await new Promise((resolve) => setTimeout(resolve, 10000));
        }

        if (!videoUri) {
            return res
                .status(202)
                .json({ status: "pending", message: "Video not ready yet, try again later" });
        }

        const encoded = encodeURIComponent(videoUri);
        const proxyPath = `/api/veo/video?url=${encoded}`;

        res.json({ videoPath: proxyPath });
    } catch (err) {
        res.status(500).json({ error: "Veo request failed" });
    }
});

app.get("/api/veo/video", async (req, res) => {
    const { url } = req.query;

    if (!url || typeof url !== "string") {
        return res.status(400).json({ error: "url query parameter is required" });
    }

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not set" });
    }

    try {
        const decodedUrl = decodeURIComponent(url);
        const videoResponse = await fetch(decodedUrl, {
            headers: {
                "x-goog-api-key": GEMINI_API_KEY
            }
        });

        if (!videoResponse.ok) {
            const errData = await videoResponse.json().catch(() => null);
            return res
                .status(videoResponse.status)
                .json(errData || { error: "Failed to fetch video" });
        }

        const arrayBuffer = await videoResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const contentType =
            videoResponse.headers.get("content-type") || "video/mp4";

        res.setHeader("Content-Type", contentType);
        res.send(buffer);
    } catch (err) {
        res.status(500).json({ error: "Failed to proxy video" });
    }
});

app.post("/api/runway", async (req, res) => {
    const { prompt, ratio, duration, model, mode, imageBase64, imageMimeType } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        const selectedModel = model || "gen4_turbo";
        const selectedRatio = ratio || "1280:720";
        const selectedDuration = duration || 5;

        let task;

        if (mode === "image" && imageBase64) {
            let dataUri = imageBase64;
            if (!imageBase64.startsWith("data:")) {
                const mimeType = imageMimeType || "image/png";
                dataUri = `data:${mimeType};base64,${imageBase64}`;
            }

            task = await runwayClient.imageToVideo
                .create({
                    model: selectedModel,
                    promptImage: dataUri,
                    promptText: prompt,
                    ratio: selectedRatio,
                    duration: selectedDuration
                })
                .waitForTaskOutput();
        } else {
            task = await runwayClient.textToVideo
                .create({
                    model: selectedModel,
                    promptText: prompt,
                    ratio: selectedRatio,
                    duration: selectedDuration
                })
                .waitForTaskOutput();
        }

        let videoUrl = null;

        if (task && Array.isArray(task.output) && task.output.length > 0) {
            const first = task.output[0];
            if (typeof first === "string") {
                videoUrl = first;
            } else if (first && typeof first === "object") {
                videoUrl = first.uri || first.url || null;
            }
        }

        return res.json({
            videoUrl,
            task
        });
    } catch (err) {
        return res.status(500).json({
            error: "Runway API error",
            details: err && err.message ? err.message : String(err)
        });
    }
});

app.post("/api/kling", async (req, res) => {
    const { prompt, aspectRatio, duration, model, mode, imageBase64, imageMimeType } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    if (!AIML_API_KEY) {
        return res.status(500).json({ error: "AIML_API_KEY is not set" });
    }

    try {
        const url = "https://api.aimlapi.com/v2/generate/video/kling/generation";
        const headers = {
            Authorization: `Bearer ${AIML_API_KEY}`,
            "Content-Type": "application/json"
        };

        let body;

        if (mode === "image" && imageBase64) {
            let dataUri = imageBase64;
            if (!imageBase64.startsWith("data:")) {
                const mime = imageMimeType || "image/png";
                dataUri = `data:${mime};base64,${imageBase64}`;
            }

            body = {
                model: model || "kling-video/v1/standard/image-to-video",
                image_url: dataUri,
                prompt,
                type: "image-to-video",
                duration: duration || "5"
            };
        } else {
            body = {
                model: model || "kling-video/v1/standard/text-to-video",
                prompt,
                duration: duration || "5"
            };
            if (aspectRatio) {
                body.aspect_ratio = aspectRatio;
            }
        }

        const response = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        const status = data.status;
        let videoUrl = null;

        if (data.video && typeof data.video.url === "string") {
            videoUrl = data.video.url;
        }

        return res.json({
            videoUrl,
            status,
            raw: data
        });
    } catch (err) {
        return res.status(500).json({
            error: "Kling API error",
            details: err && err.message ? err.message : String(err)
        });
    }
});

app.post("/api/pika", async (req, res) => {
    const { prompt, mode, imageBase64, imageMimeType } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    if (!POLLO_API_KEY) {
        return res.status(500).json({ error: "POLLO_API_KEY is not set" });
    }

    try {
        const url = "https://pollo.ai/api/platform/generation/pika/pika-v2-2";

        let imageField = null;

        if (mode === "image" && imageBase64) {
            if (imageBase64.startsWith("data:")) {
                imageField = imageBase64;
            } else {
                const mimeType = imageMimeType || "image/png";
                imageField = `data:${mimeType};base64,${imageBase64}`;
            }
        }

        const body = {
            input: {
                prompt,
                image: imageField,
                negativePrompt: "",
                seed: Math.floor(Math.random() * 1_000_000),
                resolution: "720p",
                length: 5
            },
            webhookUrl: "" // <-- important change
        };

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": POLLO_API_KEY
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            return res.status(response.status).json(data);
        }

        let videoUrl = null;

        if (data.output && Array.isArray(data.output) && data.output[0]) {
            const first = data.output[0];
            if (typeof first === "string") {
                videoUrl = first;
            } else if (first && typeof first === "object") {
                videoUrl = first.url || first.video_url || null;
            }
        } else if (typeof data.video_url === "string") {
            videoUrl = data.video_url;
        }

        return res.json({
            videoUrl,
            raw: data
        });
    } catch (err) {
        return res.status(500).json({
            error: "Pika API error",
            details: err && err.message ? err.message : String(err)
        });
    }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log("API server running on port " + port);
});
