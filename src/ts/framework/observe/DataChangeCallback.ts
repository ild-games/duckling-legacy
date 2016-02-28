import DataChangeEvent from './DataChangeEvent';
interface DataChangeCallback<T extends DataChangeEvent> {
    (event? : T) : void
}
export default DataChangeCallback;
