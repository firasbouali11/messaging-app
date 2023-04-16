const dev = true
const host_api = "localhost"
const port_api = "2020"
const prefix_host = dev ? `http://${host_api}:${port_api}` : ""

module.exports = {
    prefix_host
}