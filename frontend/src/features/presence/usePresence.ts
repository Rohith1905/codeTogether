import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useStomp } from '../../hooks/useStomp';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { setUsersOnline } from './presenceSlice';
import toast from 'react-hot-toast';

export const usePresence = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const dispatch = useDispatch();
    const { usersOnline } = useSelector((state: RootState) => state.presence);
    const { user } = useSelector((state: RootState) => state.auth);
    const { subscribe, publish, isConnected } = useStomp();

    useEffect(() => {
        if (!roomId || !isConnected || !user) return;

        // 1. Subscribe to presence updates
        const unsubscribe = subscribe(`/topic/room.${roomId}.presence`, (msg) => {
            const body = JSON.parse(msg.body);
            if (body.type === 'presence.users') {
                dispatch(setUsersOnline(body.users));
            } else if (body.type === 'presence.event') {
                if (body.event === 'joined') {
                    toast.success(body.message);
                } else if (body.event === 'left') {
                    toast(body.message, { icon: '👋' });
                }
            }
        });

        // 2. Join Room
        publish('/app/presence.join', {
            roomId,
            userId: user.id || 'u_' + user.username,
            name: user.username
        });

        return () => {
            // 3. Leave Room
            publish('/app/presence.leave', {
                roomId,
                userId: user.id || 'u_' + user.username
            });
            unsubscribe();
        };
    }, [roomId, isConnected]); // Removed user, dispatch, subscribe, publish to prevent loops as per user request

    return { usersOnline, isConnected };
};
