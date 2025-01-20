import React,{useState,useEffect,createContext,useContext,useRef} from 'react'
import io from 'socket.io-client'
import { v4 as uuidv4 } from 'uuid';
import Peer from 'peerjs';

const Context = createContext("");

export function useData(){
    return useContext(Context);
}
type users = {
    id:string,
    stream:MediaStream,
    isAdmin:boolean,
    isAudioStream:boolean,
    isLoading:boolean
}

export default function DataWrapper({children}:{children:React.ReactNode}) {

    let initialUser = {
        id:'',
        stream:{},
        isAdmin:false,
        isAudioStream:false,
        isLoading:true
    }
    const [socket,setSocket] = useState<any>(null)
    const [roomId ,setRoomId] = useState<string>('')
    const [myId,setMyId] = useState<string>('')
    const [peer,setPeer] = useState<Peer|null>(null)
    const firstTimeConnectRef = useRef<boolean>(true)
    const [users,setUsers] = useState<users[]>([]);
    const [myStream,setMyStream] = useState<MediaStream|null>(null);
    const peersArrRef = useRef([]);
    let usersRef = useRef<users[]>([])
    let users2Ref = useRef<users[]>([])
    let [tempData,setTempData] = useState<users[]>([])
    let [tempData2,setTempData2] = useState<users[]>([])

    function gettingMediaStream(){
        return navigator.mediaDevices.getUserMedia({
            video:{
                frameRate:{
                    ideal:60,
                    min:10
                }
            },
            audio:true
        })
    }
    function gettingAudioStream(){
        return navigator.mediaDevices.getUserMedia({
                    audio:true
                })
    }



    
    useEffect(()=>{
      let tempSocket =  io('http://localhost:3005')
      let tempId = uuidv4()

      let peer = new Peer(tempId)
      
      
      setSocket(tempSocket)
      setMyId(tempId)
      setPeer(peer)
    },[])

    // useEffect(()=>{
    //     if(tempData ===[] )
    //     return ;

    //     setUsers(prev=>[...prev,...tempData])
    //     //setTempData([])
    //     let id=setTimeout(()=>{
    //         setTempData2([])
    //     },2000)
    //     return ()=>clearTimeout(id)
    // },[tempData])

    // useEffect(()=>{
    //     if(tempData2 ===[])
    //     return ;
    //     setUsers(prev=>[...prev,...tempData2])
    //     //setTempData2([])
    //     let id=setTimeout(()=>{
    //      setTempData2([])
    //     },2000)

    //     return ()=>clearTimeout(id)
    // },[tempData2])

    useEffect(()=>{
        // gettingMediaStream().then(bothStreams=>{

        // }).catch(err=>{
        //     getttingAudioStream().then()
        // })
        if(myId==='')
        return;
        console.log('myId is',myId)

        gettingMediaStream().then(bothStreams=>{
            setMyStream(bothStreams)
            setUsers([
                {id:myId,stream:bothStreams,isAdmin:false,isAudioStream:false,isLoading:false}
            ])
        }).catch(err=>{
            gettingAudioStream().then(audioStream=>{
                console.log(audioStream.getAudioTracks()[0].enabled,"audiostream enabled")
                console.log(audioStream)
                setMyStream(audioStream)
                setUsers([
                    {id:myId,stream:audioStream,isAdmin:false,isAudioStream:true,isLoading:false}
                ])
            })
        })
    },[myId])



    useEffect(()=>{
        if(peer ===null || myStream===null || users.length===0)
        return;

        console.log('triggering peer fn',peer,myStream)
        let id:number;
       
        
        function timeOut(){
            id = setTimeout(()=>{

            let tempUsers =  users.map((e,i)=>{
                       let element = e 
                       users2Ref.current.forEach((el,i)=>{
                            if(e.id ===el.id){
                                element=el
                            }
                       })
                       return element
                   })
            
            console.log('timeOut',users,tempUsers)
            users2Ref.current = []
            //setTempData2(tempUsers)
            setUsers(prev=>[...prev,...tempUsers])
            },2000)
        }
        
        function reply(call:any){
            console.log("replying trigerred")
            socket.emit('connected-user-data',{...users[0],toPeer:call.peer,isLoading:true,toReceiver:false})
            
            call.answer(myStream)
            
            call.on('stream',(userVideoStream:MediaStream)=>{
                //@ts-ignore
                if(!peersArrRef.current.includes(call.peer)){
                    if(id) clearTimeout(id)

                    //@ts-ignore
                    peersArrRef.current.push(call.peer)
                    console.log('2nd getting stream',userVideoStream,call.peer)
                    
                    //let tempUser = initialUser
                    let mismatched = users.filter((e,i)=> e.id !== call.peer) 
                    //let matched =  users.filter((e,i)=> e.id === call.peer)
                
                    let tempUser
                    for(let i=0;i<users2Ref.current.length;i++){
                        
                        if(users2Ref.current[i].id ===call.peer){
                        users2Ref.current[i] = {...users2Ref.current[i],stream:userVideoStream,isLoading:false}
                        console.log('tempuser 2',tempUser,users2Ref.current)
                        // usersRef.current.splice(i,1)
                        
                        break
                        }
                    }
                    timeOut()
                    
                }
            })
            call.on('close',()=>{
                // let tempUsers= users.filter((e,i)=>e.id !== call.peer)
                // console.log('2nd temp users',tempUsers)
                // setUsers(tempUsers)
            })
    }
        peer.on('call',reply)

        return ()=>{
            peer.off('call',reply)
        }

    },[peer,myStream,users])

    useEffect(()=>{
        if(socket === null || myStream===null)
        return ;

        console.log('user-connected effect')
        //this runs for first time 
       //socket.on('connect',()=>{console.log('1st connect triggered');console.log('connected')})
       socket.on('connect',()=>{
           socket.emit('connected',myId)
        if(firstTimeConnectRef.current === true){
            console.log('1st connect triggered');
           
        }
        else {
        console.log('2nd connect triggered')
        socket.emit('join-room',roomId,myId)
            }
        })

        socket.on('disconnect',()=>console.log('disconnected'))
        
        socket.on('user-disconnected',(userid:string)=>{
            console.log('user-disconnected',userid)
        })
        
    },[socket,myStream])
    
    useEffect(()=>{
        if(socket === null || myStream===null)
        return ;

        let id
        function timeOut(){
            id = setTimeout(()=>{

            let tempUsers =  users.map((e,i)=>{
                       let element = e 
                       usersRef.current.forEach((el,i)=>{
                            if(e.id ===el.id){
                                element=el
                            }
                       })
                       return element
                   })
            
            console.log('timeOut 1',users,tempUsers)
            usersRef.current = []
            //setTempData(tempUsers)
            setUsers(prev=>[...prev,...tempUsers])
            },2000)
        }
        
        function connectToNewUser(stream:MediaStream,newUserId:string){
            console.log(peer,socket,stream)
            socket.emit('connected-user-data',{...users[0],toPeer:newUserId,isLoading:true,toReceiver:true})
            
                const call = peer?.call(newUserId,stream)
                
                call?.on('stream',(userVideoStream)=>{
                    //@ts-ignore
                    console.log(!peersArrRef.current.includes(call.peer),"includes 1st call peer")
                    //@ts-ignore
                    if(!peersArrRef.current.includes(call.peer)){
                        //@ts-ignore
                        peersArrRef.current.push(call.peer)
                        console.log('getting video stream',userVideoStream)
                        //let tempUser = initialUser
                        
                           // let mismatched = users.filter((e,i)=> e.id !== call.peer) 
                           // let matched =  users.filter((e,i)=> e.id === call.peer)
                           // let matched=usersRef.current.filter((e,i)=>myId ===e.toPeer)
    
                            let tempUser
                            for(let i=0;i<usersRef.current.length;i++){
                                
                                if(usersRef.current[i].id ===call.peer){
                                usersRef.current[i] = {...usersRef.current[i],stream:userVideoStream,isLoading:false}
                                console.log('tempuser 1',tempUser,usersRef.current)
                                // usersRef.current.splice(i,1)
                                
                                break
                                }
                            }
                            timeOut()
                            
                        
                    }
                })
                call?.on('close',()=>{
                    
                    let tempUsers= users.filter((e,i)=>e.id !== newUserId)
                    console.log('1st temp users',tempUsers)
                    setUsers(tempUsers)
                })
    
           
        }
        function newUser(userId:string){
            console.log('user-connected',userId)
            //send my stream to this user 
            
            //@ts-ignore
           console.log(users)
           //@ts-ignore
           connectToNewUser(myStream,userId)
        }
        socket.on('user-connected',newUser)

        
        return ()=>socket.off('user-connected',newUser)
    },[socket,myStream,users])

    useEffect(()=>{
        if(socket ===null)
        return ;
    
       
        function removeUser(userId:string){
            let tempUsers= users.filter((e,i)=>e.id !== userId)
            console.log('tab-close',tempUsers)
            setUsers(tempUsers)
            
        }
        function modifyingUser(data:any){
            console.log("connected user data",data)
            //let misMatched = users.filter((e,i)=>e.id !== data.toPeer)
            //let matched = users.filter((e,i)=>e.id === data.toPeer)
            //console.log('matched',matched,misMatched)
            // matched[0].isAudioStream = data.isAudioStream
            //matched[0].isAdmin = data.isAdmin
            // setUsers([...misMatched,...matched])

            if(data.toReceiver===true){
                users2Ref.current.push(data)   
            }else{
                usersRef.current.push(data)
            }
            setUsers(prev=>[...prev,data])

       }
        socket.on('tab-close-remove-video',removeUser)
        socket.on('receive-connected-user-data',modifyingUser)

        function executeBeforeTabClose(e:Event){
            socket.emit('tab-close',myId)
        }

        let id= window.addEventListener('beforeunload',executeBeforeTabClose,{capture:true})
        return ()=>{ 
            window.removeEventListener('beforeunload',executeBeforeTabClose,{capture:true})
            socket.off('tab-close-remove-video',removeUser)
            socket.off('receive-connected-user-data',modifyingUser) 
                    }
    },[socket,users])

    useEffect(()=>{
        if(peer===null || socket === null || myId==='' || roomId==='')
        return ;
        
        peer.on('open',myId=>{
            
            console.log('peer open triggered')
            socket.emit('join-room',roomId,myId)
            firstTimeConnectRef.current = false;
        })
        peer.on("connection", function (conn) {
            console.log('peer connection triggered')    
        });
    },[peer,socket,roomId,myId])

    

    let values = {
        roomId,setRoomId,
        myId,setMyId,
        socket,setSocket,
        users,setUsers,
        myStream,setMyStream
    }

    return (
        //@ts-ignore
    <Context.Provider value={values}>
        {children}
    </Context.Provider>
  )
}
