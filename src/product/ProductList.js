import ProductAdd from './ProductAdd'
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';
import React, {useState,useEffect,useContext} from 'react';
import {AuthContext, STATUS} from '../account/AuthContext';
import {Box,List,ListItemIcon,ListItemButton,ListItemText,Button, ListItem,CircularProgress,IconButton} from '@mui/material';
import { initializeApp } from "firebase/app";
import { collection ,getDocs,doc,setDoc,addDoc, onSnapshot,query, orderBy,where,deleteDoc,updateDoc,limit,getDoc} from '@firebase/firestore';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Input from '@mui/material/Input';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { getFirestore } from "firebase/firestore";
import AppMenu from '../ui/AppMenu';
import {config} from '../settings/firebaseConfig';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Edit from '@mui/icons-material/Edit';
import ImageUpload from '../ui/ImageUpload';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { getAuth} from "firebase/auth";
import Swal from 'sweetalert2';





export default function ProductList() {
  const firebaseApp = initializeApp(config);
const db = getFirestore();
console.log("db_line43:"+db);

// ??????????????????
const auth = getAuth();
const user = auth.currentUser;
if(user) {
  // ???????????????????????????????????????
  var email = user.email;
  var uid = user.uid;
  console.log("email:"+email);
} else {
  console.log("?????????");
  // ??????????????????
}

// ??????????????????????????????email?????????ctstate==0????????????
const cartAdd = async function(bfname,bfprice){
  //console.log(user);
  const q = query(collection(db,"cart"),where("ctstate", "==", 0),where("useremail","==",user.email));
  const snapshot = await getDocs(query(q) );
  //console.log("db_line64:"+db);
  //console.log("bfname:",bfname,",email:",user.email);
  
  if (snapshot.empty==true) { 
  // ?????????????????????????????????????????????cart_id++????????????????????????cart???ctcontent
    //???????????????id
    const querySnapshot = await getDocs(collection(db,"cart"));
    //console.log("querySnapshot:"+querySnapshot);
    let docId=0;
    let docRef=0;

    querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        docId = doc.id;
      });
    //??????cart????????????
    //console.log("docId:"+docId);
    const cartid = parseInt(docId) +1;
    //console.log("cartid:"+cartid);
    const carid = cartid.toString();
    //console.log("Line84_carid:"+carid);
    try{
      await setDoc(doc(db, "cart", carid), {
        ctaddress:"",
        ctstate: 0,
        useremail: email
      });
      //console.log("line89:"+cartid);
      //???ctcontents
        docRef = doc(db,"cart",carid );
      const cartttRef = await addDoc(collection(docRef,"ctcontent"),{
        bfname: bfname,
        bfprice:bfprice,
        bfquantity: 1,
        useremail: email
        });
        //console.log(cartttRef.id);

        Swal.fire({
          icon: 'success',
          title: '?????????????????????',
          text: '??????????????????????????????'
        })

      }catch(e){
        console.log(e);
      }
  }
  else{
  // ?????????????????????????????????????????????cart????????????content
    console.log("db_line93:"+db);
    console.log("useremail:"+user.email);
    const maxid = await getDocs(query(collection(db,"cart"),
                                      where("useremail","==",user.email)) );
    let docRef=0;
    let docId=0;
    console.log(maxid);
    maxid.forEach((doc)=>{
      console.log(doc.id, " => ", doc.data());
      docRef = doc;
      docId = doc.id;
    });
    console.log(docId);
    try{

      docRef = doc(db,"cart",docId );
      const cartttRef = await addDoc(collection(docRef,"ctcontent"),{
        bfname: bfname,
        bfprice:bfprice,
        bfquantity: 1,
        useremail: email
        });
        console.log(cartttRef.id);

        Swal.fire({
          icon: 'success',
          title: '?????????????????????',
          text: '??????????????????????????????'
        })

      }catch(e){
        console.log(e);
      }
  }

}


    const authContext = useContext(AuthContext);
    const[selectedIndex,setSelectedIndex]=React.useState(1);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
      };
    const [products,setProducts]=useState([]);
      useEffect(()=>{

        async function readData() {
          //var citiesRef = collection(db, "product");
          //const q = await getDocs(query(citiesRef, where("price", ">=", 10000)));
          setIsLoading(true);
          const querySnapshot = await getDocs(collection(db, "breakfast"));
    
          const temp = [];
         //q.foreach(doc) => ........
          querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            temp.push({id:doc.id,bfdesc:doc.data().bfdesc,bfname:doc.data().bfname, bfprice:doc.data().bfprice,bfimage:doc.data().bfimage});
          });
    
          console.log(temp);
          setProducts([...temp]);
          setIsLoading(false);
        }
    
        readData();
    
      },[db]);
      const [userss,setUsersss]=useState([]);
      useEffect(()=>{

        async function readData() {
          //var citiesRef = collection(db, "product");
          //const q = await getDocs(query(citiesRef, where("price", ">=", 10000)));
          setIsLoading(true);
          var citiesRef = collection(db, "user");
          const q = await getDocs(query(citiesRef, where("useremail", "==", user.email)));
    
          const tempU = [];
         //q.foreach(doc) => ........
          q.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            tempU.push({useremail:doc.data().useremail, userauth:doc.data().userauth,username:doc.data().username});
          });
    
          console.log(tempU);
          setUsersss([...tempU]);
          setIsLoading(false);
        }
    
        readData();
    
      },[db]);
      {userss.map((usersa) =>
        console.log(usersa.userauth)
        )}
      const unsub = onSnapshot(doc(db, "breakfast", "SF"), (doc) => {
        console.log("Current data: ", doc.data());
      });

   const [open, setOpen] = React.useState(false);

   const handleClickOpen = () => {
     setOpen(true);
   };
 
   const handleClose = () => {
     setOpen(false);
   };

   

  const insert = function(newProduct){
      setProducts(oldProducts=>[...oldProducts, newProduct]);
    
  }


const [deleted,setDeleted]=useState([]);

const deleteData = async function(id){

  try{
    console.log(id);
    setIsLoading(true);
    await deleteDoc(doc(db, "breakfast", id));
    //console.log("deleted");
    setDeleted(deleted+1);
    setIsLoading(false);
    Swal.fire({
      icon: 'success',
      title: '????????????????????????????????????'
    })
  }
  catch (error){
    console.log(error);
  }

}

const [product, setProduct] = useState({bfname:"",bfprice:0,bfimage:"",bfdesc:""})
const handleClick = function(e){
  setProduct({...product,[e.target.name]:e.target.value})
}
const edit = async function(product){
  try{
    console.log(productid);
    await updateDoc(doc(db,"breakfast",productid),{
      bfprice:parseInt(product.bfprice),
      bfname:product.bfname,
      bfdesc:product.bfdesc
    });
    Swal.fire({
      icon: 'success',
      title: '????????????????????????????????????'
    })
  }

  catch(e){
    console.log(e);
  }
  
}

const[productid,setProductid]=useState(0);
const editButton =  function(product){
  handleClickOpen();
  setProductid(product.id); 
}


 
  const [isLoading, setIsLoading] = useState(false);
  const ImList=function(){
    return(
      <Stack sx={{ width: '100%' ,maxWidth: 360}} spacing={2} >
        {products.map((product, index) => 
        <Card>
          <CardMedia
            component="img"
            height="140"
            image={product.bfimage}
          />
       <CardContent divider key={index}>
        
       <Typography gutterBottom variant="h5" component="div">
         {product.bfname}
       </Typography>
       <Typography variant="body2" color="text.secondary">
         {product.bfdesc}<br/>
         {"NT$"+product.bfprice}
       </Typography>
       </CardContent>
          <CardActions>
          <Box>
            <Button onClick={()=>cartAdd(product.bfname,product.bfprice)}  variant="contained" startIcon={<ShoppingCartIcon/>} color="secondary">???????????????</Button>
          </Box>
          {userss.map((usersa) => 
          <Box >
          {(usersa.userauth!="1")?
          <Box></Box>:
            <Button style={{borderRadius:50}} onClick={()=>editButton(product)} variant="contained" startIcon={<Edit/>} color="primary" >??????</Button>
            
          }
          </Box>
          )}
          {userss.map((usersa) => 
          <Box >
          {(usersa.userauth!="1")?
          <Box></Box>:
          <Button style={{borderRadius:50}} onClick={()=>deleteData(product.id)} variant="contained" startIcon={<DeleteIcon/>} color="primary" >??????</Button>
            
          }
          </Box>
          )}
          
          </CardActions>
     
     </Card>
      )}
      </Stack>
    )
  }
  
  

  return (
<Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>

<AppMenu/>

{!isLoading ?
<ImList/>
 :
<CircularProgress />

}

<Dialog open={open} onClose={handleClose}>
<DialogTitle id="alert-dialog-title">{"????????????"}
</DialogTitle>
<DialogContent>
????????????:<Input type="text" name="bfname" value={product.bfname} onChange={handleClick} /><br/>
????????????:<Input type="number" name="bfprice" value={product.bfprice} onChange={handleClick}/><br/>
????????????:
<Input type = "text" name = "bfdesc" value={product.bfdesc} onChange={handleClick}/>
</DialogContent>
<DialogActions>
<Button variant="contained" color="primary" onClick={()=>edit(product)}>??????</Button>
<Button onClick={handleClose}>??????</Button>
</DialogActions>
</Dialog>



<ProductAdd update={insert}/>

    
    </Box>
  );
  

}