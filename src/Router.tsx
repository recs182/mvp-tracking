import TrackingContainer from '@/containers/TrackingContainer/TrackingContainer'
import { BrowserRouter, Route } from 'react-router'

function Router() {
    return (
        <BrowserRouter>
            <Route index element={<TrackingContainer />} />
        </BrowserRouter>
    )
}

export default Router
