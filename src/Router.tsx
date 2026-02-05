import TrackingContainer from '@/containers/TrackingContainer/TrackingContainer'
import { BrowserRouter, Route, Routes } from 'react-router'

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<TrackingContainer />} index path="/mvp-tracking" />
            </Routes>
        </BrowserRouter>
    )
}

export default Router
