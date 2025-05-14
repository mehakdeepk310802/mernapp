import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPasswordAdmin() {
    const { token } = useParams();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/admin/resetpasswordadmin/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });

            // Check if response is ok before trying to parse JSON
            if (!response.ok) {
                const errorText = await response.text();
                try {
                    // Try to parse error as JSON
                    const errorJson = JSON.parse(errorText);
                    throw new Error(errorJson.message || 'Password reset failed');
                } catch (e) {
                    // If parsing fails, use text response
                    throw new Error(errorText || 'Password reset failed');
                }
            }

            const data = await response.json();
            setMessage('Password reset successfully! Redirecting to login...');
            setTimeout(() => navigate('/loginadmin'), 3000);
        } catch (error) {
            setError(error.message || 'An error occurred during password reset');
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '400px' }}>
            <h2 className="mb-4">Reset Admin Password</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">New Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={password}  
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        minLength="6"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input 
                        type="password" 
                        className="form-control" 
                        value={confirmPassword} 
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        required 
                        minLength="6"
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
            </form>

            {message && <div className="alert alert-success mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
    );
}