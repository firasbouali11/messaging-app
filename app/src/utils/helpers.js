const { prefix_host } = require("./config")

const GET = async (endpoint, resp_type="json") => {
    const resp = await fetch(prefix_host + endpoint, {credentials: "include"})
    if(resp.status === 200){
        const data = resp_type === "json" ? await resp.json() : await resp.text()
        return {code: resp.status, data}
    }
    return { code: resp.status, data: await resp.text() }
}

const POST = async (endpoint, payload, resp_type = "json", cookie=false) => {
    const resp = await fetch(prefix_host + endpoint,{
        method: "post",
        credentials: "include",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if(resp.status === 200){
        const cookie_data = cookie ? resp.headers.get("cookie") : null 
        const data = resp_type === "json" ? await resp.json() : await resp.text()
        return {code: resp.status, data, cookie: cookie_data}
    }
    return { code: resp.status, data: await resp.text() }
}

const PUT = async (endpoint, payload, resp_type = "json") => {
    const resp = await fetch(prefix_host + endpoint,{
        method: "put",
        credentials: "include",
        headers: {
            "content-type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    if(resp_type === "json" ){
        const data = await resp.json()
        return {code: resp.status, data}
    }
    return { code: resp.status, data: await resp.text() }
}

const ALERT = (code, data) => {
    alert(`code: ${code}\nmessage: ${data}`)
} 

module.exports = {GET, POST, PUT, ALERT}