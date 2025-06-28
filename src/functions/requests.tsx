
export  function sendToServer(blob:any,url:string,SESSION_ID,data){
   //console.log(blob)
   let reader = new FileReader()
   reader.onloadend = ()=>{
     let base64data:any = reader.result;
    // console.log(`base64`,base64data)
    

    console.log(data)
    
    
    data = {...data, 
       audiomessage:base64data.split(',')[1],
    }
    
   let audioData = JSON.stringify(data)
   console.log(`%c just before sending data ${new Date().toLocaleTimeString()}`,'background-color:teal;color:white')
   
   //socket.emit('audiomessagefromclient',audioData)
   fetch(url,{
     method:'POST',
     headers:{
        'Accept':'application.json',
        'Content-Type':'application/json',
        //'mode': 'no-cors'
     },
     body:audioData,
     cache:'default',}).then(res=>res.json())
     .then(result=>console.log("res from audio server",result))
   }
  reader.readAsDataURL(blob)
 }

 
export function PostReq(url,data){
    
    return new Promise((resolve,reject)=>{
        fetch(url,{
            // method:'POST',
            // headers:{
            //    'Accept':'application.json',
            //    'Content-Type':'application/json',
            //  //  'mode': 'no-cors'
            // },
            method: "POST",
            headers: { "Content-Type": "application/json" },
            
            body:JSON.stringify(data),
            cache:'default',})
            .then(res=>{
               console.log("res from login server",res)
               return res.json()
            }).then((result)=>{
              
              console.log(result)
              // if(result.error!==null)
              //   reject(result.error)
              // if(result.result===true){
              //  // console.log(result)
              //     resolve(result.data)
              // }
              resolve(result)
            })
        
    })
    
  }

  export function GetReq(url){
    
    return new Promise((resolve,reject)=>{
        fetch(url,{
            method:'POST',
            headers:{
               'Accept':'application.json',
               'Content-Type':'application/json'
            },
    
            //body:JSON.stringify(data),
            cache:'default',})
            .then(res=>{
               console.log("res from login server",res)
               return res.json()
            }).then((result)=>{
              
              console.log(result)

              // if(result.error!==null)
              //   reject(result.error)
              // if(result.result===true){
              //  // console.log(result)
              //     resolve(result.data)
              // }
              resolve(result)
            })
        
    })
    
  }