import React, { useState } from 'react';
import { addCommentToBan } from '../api/banApi';

const AddCommentForm = ({ banId }) => {
    const [comment, setComment] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addCommentToBan(banId, comment);
            alert('Comment added successfully!');
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment"
            />
            <button type="submit">Submit</button>
        </form>
    );
};

export default AddCommentForm;