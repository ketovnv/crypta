import { observer } from 'mobx-react-lite';
import { loggerStore } from '@/stores/logger';

export const LogViewer = observer(() => {
    return (
        <div>
            {loggerStore.logs.map(log => (
                <div key={log.id} style={{ color: log.type === 'error' ? 'red' : 'inherit' }}>
                    [{log.timestamp}] {JSON.stringify(log.message)}
                </div>
            ))}
        </div>
    );
});