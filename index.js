import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from 'dotenv';

dotenv.config();

const app=express();
const port=process.env.port;
console.log(port);

const db=new pg.Client({
    connectionString:process.env.connection
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

db.query("CREATE TABLE IF NOT EXISTS todo ( id SERIAL PRIMARY KEY NOT NULL, list VARCHAR(255) NOT NULL );");

app.get('/',async (req,res)=>{
        const response=await db.query("SELECT * FROM todo ORDER BY id ASC;");
        const list=response.rows;

        res.render("index.ejs",{
            works:list
        })
});

app.post("/delete",async (req,res)=>{
    const id=req.body.deleteItemId;
    const response=await db.query("DELETE FROM todo WHERE id=$1",
    [id]);
    res.redirect("/");
});

app.post("/edit",async (req,res)=>{
    const id=req.body.updateItemId;
    const list=req.body.updateItemlist;
    const response=await db.query("UPDATE todo SET list=$1 WHERE id=$2;",
    [list,id]);
    res.redirect("/");

})

app.post("/add", async (req,res)=>{
    const list=req.body.newItem;
    if(list){
    const response=await db.query("INSERT INTO todo (list) values ($1);",
    [list]);
    res.redirect("/")
    }
    else{

        res.redirect("/");
    }
} )

app.listen(port,()=>{
    console.log(`Server listening on port ${port}`);
});
