import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface CommentProps {
    userName: string;
    comment: string;
    onGoToGame: () => void;
}

const YourComments: React.FC<CommentProps> = ({ userName, comment, onGoToGame }) => {
    return (
        <div style={{ border: '1px solid #ddd', borderRadius: '5px', margin: '10px', padding: '10px', backgroundColor: '#563C2D' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaUserCircle size={40} style={{ marginRight: '10px' }} />
                <div style={{ flex: 1, textAlign: 'left' }}>
                    <h5 style={{ margin: 0, color: 'white' }}>{userName}</h5>
                    <p style={{ margin: 0, color: '#B28F4C' }}>{comment}</p>
                </div>
                <div
                    onClick={onGoToGame}
                    style={{
                        backgroundColor: '#C9B57B',
                        color: 'white',
                        padding: '10px 10px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        textAlign: 'center'
                    }}
                >
                    Go To Game
                </div>
            </div>
        </div>
    );
};

export default YourComments;