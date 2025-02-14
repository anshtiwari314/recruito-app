export function PostReq(url,data){
    
    return new Promise((resolve,reject)=>{
        fetch(url,{
            method:'POST',
            headers:{
               'Accept':'application.json',
               'Content-Type':'application/json'
            },
    
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