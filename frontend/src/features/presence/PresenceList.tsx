import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface PresenceListProps {
    usersOnline: Array<{ userId: string; name: string }>;
}

const PresenceList: React.FC<PresenceListProps> = ({ usersOnline }) => {
    // Removed usePresence() call here to avoid double subscription
    const { user: currentUser } = useSelector((state: RootState) => state.auth);

    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
                Online Users ({usersOnline.length})
            </h3>

            <ul className="space-y-1">
                {usersOnline.map((u) => (
                    <li key={u.userId} className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">
                        {u.name}
                        {currentUser?.username === u.name && <span className="text-gray-500"> (you)</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PresenceList;
