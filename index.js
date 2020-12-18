const express = require('express');
const app = express();
const PORT = 5000
const fs = require('fs');
app.use(express.static('public'))
app.set('view engine', 'ejs')
// Wir estellen die Datei von Hand mit einem leeren Array und importieren sie. Das hätte hier Zeile 10-24 gespart.
let myDataEasy = require('./data.json')

let myData = []
if (fs.existsSync('./data.json')) {
    console.log("Datei existiert");
    fs.readFile('./data.json', 'utf8', (err, data) => {
        if (err) throw err
        // Um aus dem JSON Format ein JS Format zu machen nutzen wir JSON.parse
        myData = JSON.parse(data)
        // console.log(myData);
    })
} else {
    console.log("Datei existiert nicht");
    fs.writeFile('./data.json', "[]", 'utf8', err => {
        if (err) throw err
    })
}



// Wir brauchen Middelware um die Post Aktion in lesbare Daten umzuwandeln.
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.render('index', { title: "Main", msg: "" })
})
// Da wir auf /add etwas posten bzw schreiben wollen müssen wir hier auch das .post nutzen!
app.post('/add', (req, res) => {
    // console.log(req);
    console.log(req.body);
    // res.status(201).end()
    // res.status(201).redirect('/')
    myData.push(req.body)
    // Wir schreiben nun myData in die data.json. Um aus dem JavaScript Objekt ein JSON Objekt zu machen brauchen wir JSON.stringify()
    fs.writeFile('./data.json', JSON.stringify(myData), 'utf8', err => {
        if (err) throw err
    })
    res.status(201).render('index', { title: "Main", msg: `${req.body.firstName}, thank you for your Message!` })
})
app.get('/users', (req, res) => {
    res.render('users', { title: "Users", myData })
})


app.listen(PORT, () => console.log(`server running on http://localhost:${PORT}`))