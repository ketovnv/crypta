import { observer } from 'mobx-react-lite';
import { loggerStore } from './loggerStore';

export const LogViewer = observer(() => {
    const [filter, setFilter] = useState('all');

    const filteredLogs = loggerStore.logs.filter(log =>
        filter === 'all' || log.type === filter
    );

    return (
        <div className="log-viewer">
            <div className="log-controls">
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                    <option value="all">Все логи</option>
                    <option value="info">Информация</option>
                    <option value="success">Успех</option>
                    <option value="warning">Предупреждения</option>
                    <option value="error">Ошибки</option>
                    <option value="debug">Отладка</option>
                </select>
                <button onClick={() => loggerStore.clearLogs()}>
                    Очистить
                </button>
            </div>

            <div className="log-list">
                {filteredLogs.map(log => (
                    <div
                        key={log.id}
                        className={`log-entry log-${log.type}`}
                        style={{ paddingLeft: log.groupStack.length * 16 }}
                    >
                        <span className="log-time">[{log.timestamp}]</span>
                        <span className="log-message">{log.message}</span>
                    </div>
                ))}
            </div>
        </div>
    );
});