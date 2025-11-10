import { Pool } from "pg";

const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_jWXHQRi5h0FU@ep-raspy-dew-abfq95qt-pooler.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export default async function handler(req,res){
  const {method} = req;
  try{
    if(method==="POST"){
      const {action,name,family,email,password,userId,amount} = req.body;
      if(action==="login"){
        const result = await pool.query("SELECT * FROM users WHERE email=$1 AND password=$2",[email,password]);
        if(result.rows.length>0) return res.status(200).json({success:true,user:result.rows[0]});
        return res.status(200).json({success:false,message:"خطأ في البريد أو كلمة المرور"});
      }
      if(action==="create"){
        await pool.query("INSERT INTO users (name,family,email,password,balance,isAdmin) VALUES ($1,$2,$3,$4,0,false) ON CONFLICT (email) DO NOTHING",[name,family,email,password]);
        return res.status(200).json({success:true});
      }
      if(action==="add") { await pool.query("UPDATE users SET balance=balance+$1 WHERE id=$2",[amount,userId]); return res.status(200).json({success:true}); }
      if(action==="remove") { await pool.query("UPDATE users SET balance=balance-$1 WHERE id=$2",[amount,userId]); return res.status(200).json({success:true}); }
    }
    if(method==="DELETE"){ const {id} = req.query; await pool.query("DELETE FROM users WHERE id=$1",[id]); return res.status(200).json({success:true});}
    res.status(405).json({success:false,message:"Method not allowed"});
  }catch(err){res.status(500).json({success:false,message:err.message});}
}