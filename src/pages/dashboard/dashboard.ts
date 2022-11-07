import {Options, Vue} from 'vue-class-component';

interface IUpbitReturnData{
    current_price: number;
    current_date: string;
}

interface ICallUpbitAPI{
    data: null | IUpbitReturnData;
    msg: string;
}

const requestAjax=async({pathname}:{pathname:string}) : Promise<ICallUpbitAPI>=>{
    return new Promise((res, rej) => {
        try{
            const XHR = new XMLHttpRequest();
            XHR.open("GET", `http://127.0.0.1:3001${pathname}`) 
            XHR.send();
            XHR.onload = () => {
                if(XHR.status === 200){
                    res(JSON.parse(XHR.responseText));
                }else{
                    rej("서버 통신간 오류 발생")
                }
            };
            XHR.addEventListener("error",()=>{
                rej("서버 기동해주십시요 \n npm run back")
            })
        }catch(error){
            throw new Error();
        }
    });
};

@Options({})
export default class Dashboard extends Vue {
    created(){
        console.log("Init Vue");
    }
    mounted(){
        (async()=>{
            try{
                const {data} = await requestAjax({pathname:"/upbit/btc"});
                if(data !== null ){
                    this.changeUI({str:data.current_price.toLocaleString('ko-KR'),tagName:"h3"})
                    setInterval(async()=>{
                        const {data} = await requestAjax({pathname:"/upbit/btc"});
                        this.changeUI({str:data.current_price.toLocaleString('ko-KR'),tagName:"h3"})
                    },1000 * 60)
                }
            }catch(error){
                alert(error);
            }
        })();
    }
    changeUI({str,tagName}:{str:string,tagName:string}){
        const firstDashBoardItem = document.getElementsByClassName("inner")[0];
        const firstDashBoaardItemH3Tag =firstDashBoardItem.getElementsByTagName(tagName)[0];
        firstDashBoaardItemH3Tag.innerHTML= str;
    }
  
}
