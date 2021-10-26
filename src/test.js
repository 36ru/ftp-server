const fs = require('fs')

fs.readFile('./src/users.dat', (err, data) => {
    const list = data.toString().split(/\r\n|\r|\n/g)
    for (let i = 0; i < list.length; i++) {
        let user = list[i].split(':')
        if (user[0] === 'test' && user[1] === '123456') {
            break
        }
    }
})