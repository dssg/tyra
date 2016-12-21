import ModelSearcher from 'components/model-searcher/component';
import ModelDashboard from 'components/model-dashboard/component';
import ReactDOM from 'react-dom';

Object.defineProperty(window, 'ModelSearcher', { value: ModelSearcher })
Object.defineProperty(window, 'ModelDashboard', { value: ModelDashboard })
Object.defineProperty(window, 'ReactDOM', { value: ReactDOM })
