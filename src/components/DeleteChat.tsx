import React from "react";

type Props = {
    open: boolean;
    chatTitle: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function DeleteConfirm({ open, chatTitle, onCancel, onConfirm }: Props) {
    if (!open) return null;

    return (
        <div className="delete-popup-overlay">
            <div className="delete-popup">
                <div className="delete-popup-title">Delete chat?</div>
                <div className="delete-popup-text">
                    Are you sure you want to delete “{chatTitle}”?
                </div>

                <div className="delete-popup-actions">
                    <button className="delete-popup-btn cancel" onClick={onCancel}>
                        Cancel
                    </button>
                    <button className="delete-popup-btn confirm" onClick={onConfirm}>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
