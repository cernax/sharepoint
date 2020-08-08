import * as React from 'react';
import { IIndicadoresProps } from './IIndicadoresProps';
import {escape, round} from '@microsoft/sp-lodash-subset';
import  $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';


export interface  IndicadoresPesos {
  dolar: string;
  euro:string;
  uf:string;
  utm:string;
  ipsa:string;
}

interface IPnpstate {
  Noticia: IndicadoresPesos[];
}

async function getIndicadorFinanciero(codigoIndicador){

  let monto = 0;
  var fechaIndicador = new Date();
  var dd = fechaIndicador.getDate() < 10 ? '0' + fechaIndicador.getDate(): fechaIndicador.getDate();
  var mm = (fechaIndicador.getMonth()+1) < 10 ? '0' + (fechaIndicador.getMonth()+1) : (fechaIndicador.getMonth()+1);
  var fecha = fechaIndicador.getFullYear() + '-' + mm + '-' + dd;

  var soapXml =`<soap:Envelope xmlns:soap='http://www.w3.org/2003/05/soap-envelope' xmlns:tem='http://tempuri.org/'><soap:Header><tem:AuthHeader><!--Optional:--><tem:Username>WS_Test</tem:Username><!--Optional:--><tem:Password>WS_Test</tem:Password></tem:AuthHeader></soap:Header><soap:Body><tem:InstrumentoPorUltimoPrecio><tem:IdCodigo>${codigoIndicador}</tem:IdCodigo><tem:FechaPrecio>${fecha}</tem:FechaPrecio></tem:InstrumentoPorUltimoPrecio></soap:Body></soap:Envelope>`;

  await $.ajax({
    url: "https://sistemaprecios2.euroamerica.cl/WS_SistemaPrecios2/WSPrecios.asmx?op=InstrumentoPorUltimoPrecio",
    type: "POST",
    async:false,
    data: soapXml,
    contentType: "text/xml; charset='utf-8'",
    dataType: 'xml',
    success: data => {
      monto = round(data.all[11].textContent,2);
    },
    error: error => {
      console.log("Error: " + error.message);
    }
  });
  return monto;
}

export default class Indicadores extends React.Component<IIndicadoresProps, {}> {

  constructor(prop:IIndicadoresProps){
    super(prop);
    this.state = {
      Noticia: []
    };
  }

  public async componentDidMount() {
    await this.getDato();
  }
  public render(): React.ReactElement<IIndicadoresProps> {
    return (<App bindoutput={this.state} />);
  }
  public async getDato(){
    let indicador: IndicadoresPesos[] = [];

    const formatter = new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0
    });

    var montoDolar = await getIndicadorFinanciero(2); //USD
    var montoEuro = await getIndicadorFinanciero(3); //Euro
    var montoUF = await getIndicadorFinanciero(813); //UF
    var montoUTM = await getIndicadorFinanciero(812); //UTM
    var montoIPSA = await getIndicadorFinanciero(1750); //IPSA

    var montoDolarF = formatter.format(montoDolar).replace('€','');
    var montoEuroF = formatter.format(montoEuro).replace('€','');
    var montoUFF = formatter.format(montoUF).replace('€','');
    var montoUTMF = formatter.format(montoUTM).replace('€','');
    var montoIPSAF = formatter.format(montoIPSA).replace('€','');


    indicador.push({dolar: montoDolarF, euro: montoEuroF, uf: montoUFF, utm: montoUTMF, ipsa: montoIPSAF});
    this.setState({Noticia: indicador});
  }
}

const App = (props) => {

  const Bindvalue = props.bindoutput.Noticia.map((Outfile) =>
  <>
    <th>Dólar ${Outfile.dolar}</th>
    <th>Euro ${Outfile.euro}</th>
    <th>UF ${Outfile.uf}</th>
    <th>UTM ${Outfile.utm}</th>
    <th>IPSA{Outfile.ipsa}</th>
  </>
  );

  return (
    <>
      {/*<span role="heading" aria-level={2} style={{fontSize:"24px"}} >Indicadores</span>*/}
      <table className="table">
        <thead className="">
        {Bindvalue}
        </thead>
      </table>

    </>
  );
};
