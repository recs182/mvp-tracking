import { BrowserRouter, Route, Routes } from 'react-router'
import TrackingContainer from '@/containers/TrackingContainer/TrackingContainer'
import RtcTest from '@/containers/RTCTest/RTCTest'

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<TrackingContainer />} index path="/mvp-tracking" />
                <Route element={<RtcTest />} index path="/mvp-tracking/shareable" />
            </Routes>
        </BrowserRouter>
    )
}

export default Router
