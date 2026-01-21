import React from 'react';

const ComingSoon: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold">Coming Soon</h2>
                <p className="text-muted-foreground">This feature is under development.</p>
            </div>
        </div>
    );
};

export default ComingSoon;

