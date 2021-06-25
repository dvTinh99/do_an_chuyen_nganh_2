import Headers from './components/Headers';
import './App.css';
import axios from 'axios';
import React, { useState,useEffect } from 'react';
import {ResponsiveContainer, BarChart,Cell,CartesianGrid, Bar, XAxis, YAxis} from 'recharts';
import './components/Chart.css'
import { render } from '@testing-library/react';
import logo from './components/image_insert.png'
import Loading from './components/Loading';
import ConfirmDialog from './components/ConfirmDialog'

export default function App() {
  const CustomizedLabel = () =>({
    render () {
      const {x, y, fill, value} = this.props;
       return <text 
       
                 x={x+60} 
                 y={y} 
                 fontWeight ="bold"
                 dy={-3} 
                 fontSize='16'
                 fontFamily='sans-serif'
                 fill={fill}
                 textAnchor="middle">{value}%</text>
    }
  });
  const [image, setImage] = useState(logo)
  const [file, setFile] = useState()
  const [firstTime, setFirstTime] = useState(true)
  const [firstTimePredict, setFirstTimePredict] = useState(true)
  const [isUploaded, setIsuploaded] = useState(false)
  const [upLoadImg, setUploadImg] = useState(undefined)
  const [confirmDialog,setConfirmDialog] = useState({
    isOpen :false,
    title: "error",
    subTitle :"chon anh",
  });
  const [content,setContent] = useState("thí í content aodjasdaldaskldk a; <br/>kda;skdaslkd;ask; adlashigdfsdjfkjlk nanda ssahdhkajsdasd akdlasdgkasd abahsdk ");

  const [covid, setCovid] = useState(10)
  const [normal, setNomal] = useState(10)
  const [viemPhoi, setViemphoi] = useState(10)


  const [data,setData] = useState([
    {name: 'COVID- 19', uv: 0 ,pc :0},
    {name: 'PNEUMONIA', uv: 0,pc :0},
    {name: 'NORMAL', uv: 0,pc :0},
    
  ])
const chart = async ()=>{
     
    let res = axios.get("http://localhost:8000/")
    .then(res => {
      console.log(res)
    })
    .catch(error => console.log(error));
}

const upLoad = async ()=>{
  console.log(file);
  if(file == undefined){
    setConfirmDialog({
      isOpen :true,
      title: "Warning",
      subTitle :"Đề nghị chọn file",
    });
    // alert("đề nghị bro chọn file");
    return ;
  }
  setIsuploaded(undefined);
  let formData = new FormData()
  formData.append("file", file);
  axios.post('http://4ba856e45a82.ngrok.io/uploadfile', formData, {
    // headers: {
    //   'Content-Type': imagefile.type
    // }
    //Hiện cái vòng reload css display: block;
})
  .then((res)=>{
    
    // setIsLoading(true)
    //displash : ẩn đi
    const dataLt = res.data
    if(dataLt == "error_file") {
      setConfirmDialog({
        isOpen :true,
        title: "Warning",
        subTitle :"Đề nghị nhập ảnh đi !",
      });
      // alert("nhập file ảnh đi bro !");
    return ;
    }
    else if(!dataLt['check']) {
      setConfirmDialog({
        isOpen :true,
        title: "Warning",
        subTitle :"Đề nghị chọn ảnh x -quang phổi",
      });
      // alert("nhập ảnh ct phổi thôi bro !");
      return ;
    }
    else{
    console.log(dataLt);
    const data1 = validation(dataLt['chart']);
    console.log( "data 1 = "+data1);

    const covid = data1.split(',')[0]
    const nomal = data1.split(',')[1]
    const viemPhoi = data1.split(',')[2]
    
    var covidF = covid.split(':')[1] ;
    var normalF = nomal.split(':')[1] ;
    var penumalF =viemPhoi.split(':')[1] ;
      
    //covid thả đi, để t thử . Cái roundToTwwo này ko đúng. parseFlloat ở  trên chuyển string về float rồi đấy
    // Chưa nhân với làm tròn mà
    setCovid(covidF)
    //nomal
    setNomal(normalF)
    //viem phoi
    setViemphoi(penumalF)
    

    setData([
      {name: 'COVID- 19', uv: covidF ,pc : covidF},
      {name: 'PNEUMONIA', uv: penumalF, penumalF},
      {name: 'NORMAL', uv: normalF, pc :  normalF},
      
    ])
    setContent("COVID- 19 :" + covidF +"% \n" +
    "PNEUMONIA :" + penumalF +"% \n" +
    "NORMAL :" + normalF +"% \n");    
    }
    
    setIsuploaded(true);
    setFirstTimePredict(false);
  }).catch(err => {
    console.log(err)
  })
}
function validation(dataLt) {  
  //Covid19:1.2200294e-05,Binh thuong:0.0030984879,Benh viem phoi:0.9968893  
  console.log(dataLt);
  const covid = dataLt.split(',')[0]
    const nomal = dataLt.split(',')[1]
    const viemPhoi = dataLt.split(',')[2]
    //this is number after ","
    var n = 4;
    
    var covidF = (parseFloat(covid.split(':')[1])*100).toFixed(n);
    var normalF = (parseFloat(nomal.split(':')[1])*100).toFixed(n);
    var penumalF =(parseFloat(viemPhoi.split(':')[1])*100).toFixed(n);

    if(Math.max(covidF, normalF, penumalF) == covidF){
      var newValue = (100 - (parseFloat(penumalF)+parseFloat(normalF))).toFixed(n);
      return "Covid:"+newValue+",Binh thuong:"+normalF+",Benh viem phoi:"+penumalF ;
    } else if(Math.max(covidF, normalF, penumalF) == normalF){
      var newValue = (100 - (parseFloat(penumalF)+parseFloat(covidF))).toFixed(n);
      return "Covid:"+covidF+",Binh thuong:"+newValue+",Benh viem phoi:"+penumalF ;
    }else{
      var newValue = (100 - (parseFloat(covidF)+parseFloat(normalF))).toFixed(n);
      return "Covid:"+covidF+",Binh thuong:"+normalF+",Benh viem phoi:"+newValue ;
    }


}
function imageHandle(e){
  setFirstTime(false);
  setUploadImg(undefined);
  //this function is preview image befor send it to server
  let fileImage = e.target.files[0]
  setFile(fileImage)
  if(e.target.files && e.target.files[0]){
    let reader = new FileReader();
    reader.onload = function(e){
                setImage(e.target.result)
              }
    setTimeout(() => {
      setUploadImg(true);
      
    }, 2000);
    
    reader.readAsDataURL(e.target.files[0])
    
  }

  // upLoad();

}

function uploadImageHandle(e){
  //this function is send an image to server and get data

  upLoad();
  

}

  return (

    <div className="App">
    <Headers/>
    <ConfirmDialog
      confirmDialog = {confirmDialog}
      setConfirmDialog = {setConfirmDialog}
    />
        <div className="row">
        <div className="col-sm-7">
        <div className="imgHolder">
        <label for="customFile">
        {
          firstTime ? 
          ( <img src={image} width="400" height="400" id="img"/>)
          :
          (
                !upLoadImg ? (
            <>
            <Loading loading={upLoadImg}/>
            </>
          ):(
            <>
            <img src={image} width="400" height="400" id="img"/>
            </>
          )
          )
        }
        </label>
        </div>
        
        
        <div className="page">
          <div className="container">
            <input type="file" class="" name="image-upload" id="customFile" accept="image/*" onChange={imageHandle}/>
                
                    <button type="button"
                    className="btn btn-primary" 
                    onClick={uploadImageHandle}
                    >
                    Chẩn Đoán</button>   
         </div>
                     
         </div>
        </div>
        <div className="col-sm-4" >
        
        <div className='pt-5'>
        <div id="prediction-sidebar">
        <div>
        <h2 className="font-size: 1.2rem; text-align: center; margin-top: 1.0rem; font-weight: bold;">OUTPUT</h2>
        </div>
        
        {
          firstTimePredict ? (
            <>
            </>
          ):(
            !isUploaded ? (
            <>
            <Loading loading={isUploaded}/>
            </>
          ):(
            <>
            <ResponsiveContainer className="chart" height={300}>
            <BarChart 
            
            width={600} 
            height={300} 
            data={data}
            margin={{top: 20, right: 10, left: 0, bottom: 0}}
            >
            <XAxis dataKey="name" 
              fontFamily="Cursive"
              tickSize
              dy='25'
            />
            {/* <YAxis /> */}
            <CartesianGrid 
              vertical={false}
              stroke="#8884d8"
          />
            <Bar dataKey="uv" fill="#8884d8" 
              label={<CustomizedLabel />}
            >
              {
                    data.map((entry, index) => (
                        <Cell fill={data[index].AnswerRef === "three" ? '#61bf93' : '#61bf93'} />
                    ))
                }
            </Bar>
            </BarChart>
          </ResponsiveContainer>

          <form id="text-area">
          <textarea value= {content}/>
          </form>
          </>
          
          )
          )
          
        }
           
        </div>
        </div>
      
      </div>
      </div>
    </div>
  );
}


