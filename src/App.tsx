import { HashRouter as Router, Route, Routes } from "react-router-dom"
import { Insights } from './app/Insights'
import { Home } from './app/Home'
import Layout from './app/Layout'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home?" element={<Layout><Home /></Layout>} />
        <Route path="/insights/:subpath?/:path?" element={<Layout><Insights /></Layout>} />

        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </Router>
  )
}

export default App
