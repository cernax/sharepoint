import * as React from 'react';
import {Component, useEffect, useRef, useState} from "react";
import "@pnp/polyfill-ie11";
import { ITemporizadorProps } from './ITemporizadorProps';
import {Web} from "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Temporizador.module.scss";
import { sp } from "@pnp/sp";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

export interface  getTemporizador {
  Fecha:string;
  Titulo:string;
}


interface IPnpstate {
  Estado: getTemporizador[];
}

export default class Temporizador extends React.Component<ITemporizadorProps, {}> {

  constructor(prop: ITemporizadorProps) {
    super(prop);
    this.state = {
      Noticia: []
    };
  }
  public async componentDidMount() {

    this.getTemporizador();
  }

  public render(): React.ReactElement<ITemporizadorProps> {
    return (<App bindoutput={this.state} />);
  }
  private async getTemporizador(): Promise<getTemporizador[]>{
    return new Promise<getTemporizador[]>(async (resolve, reject) => {
      let tempo: getTemporizador[] = [];

      try {
        const w = Web("https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/");
        let resp = await w.lists.getByTitle("Temporizador").items
          .select("ID", "Title", "Descripcion", "FechaDelEvento", "MostrarEnHome")
          .filter("MostrarEnHome eq 1")
          .orderBy("FechaDelEvento ", false)
          .top(1)
          .get();

        resp.map((dato) => {
          tempo.push({Fecha: dato.FechaDelEvento, Titulo: dato.Title});
        });

        this.setState({Noticia: tempo});
      } catch (e) {
        console.error(e);
      }
      resolve(tempo);
    });

  }
}


const App = (props) => {

  var dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sabado'];
  var hoy = new Date();

  let fec = props.bindoutput.Noticia.map((Outfile) => fec = Outfile.Fecha);
  let titulo = props.bindoutput.Noticia.map((Outfile) => titulo = Outfile.Titulo);

  const [timerDays, setTimerDays] = useState('00');
  const [timerHours, setTimerHours] = useState('00');
  const [timerMinutes, setTimerMinutes] = useState('00');
  const [timerSeconds, setTimerSeconds] = useState('00');

  const [distances, setdistance] = useState(0);

  let interval;
  let distance = 0;

  let starTimer = () => {

    const countdownDate = new Date(fec[0]).getTime();

    interval = setInterval(() => {

      const now = new Date().getTime();
      distance = countdownDate - now;

      let days = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().length > 1 ? Math.floor(distance / (1000 * 60 * 60 * 24)): '0' + Math.floor(distance / (1000 * 60 * 60 * 24)).toString() ;
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().length > 1 ? Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) : '0' + Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString();
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().length > 1 ? Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)) : '0' + Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString();
      let seconds = Math.floor((distance % (1000 * 60)) / 1000).toString().length > 1 ? Math.floor((distance % (1000 * 60)) / 1000) : '0' + Math.floor((distance % (1000 * 60)) / 1000).toString();

      if (distance < 0) {
        clearInterval(interval);
      } else {
        setTimerDays(days.toString());
        setTimerHours(hours.toString());
        setTimerMinutes(minutes.toString());
        setTimerSeconds(seconds.toString());
        setdistance(distance);
      }

    }, 1000);
  };
  useEffect(() => {
    starTimer();
    return () => {
      clearInterval(interval);
    };
  });

  const event =
    <>
      <div style={{textAlign:"center"}}>
        <span role="heading" aria-level={2} style={{fontSize:"24px", color: "#c00518"}}>Faltan</span>
        <div>
          <div className="row justify-content-center" >
            <div className="col-1" style={{ fontSize: "25px", paddingLeft:"8px", paddingRight:"0px"}}>{timerDays == "NaN" ? '00': timerDays}</div>
            <div className="col-1" style={{ fontSize: "25px", paddingLeft:"0px", paddingRight:"55px"}}>Días</div>
          </div>
          <div className="row justify-content-center">
            <div className="col-1" style={{paddingLeft:"13px", paddingRight:"0px"}}>HRS</div>
            <div />
            <div className="col-1" style={{paddingLeft:"5px", paddingRight:"0px"}}>MIN</div>
            <div />
            <div className="col-1" style={{paddingLeft:"0px", paddingRight:"21px"}}>SEG</div>
          </div>
          <div className="row justify-content-center" style={{width:"95%", paddingLeft:"14%"}}>
            <div className="col-1" style={{paddingLeft:"0px", paddingRight:"0px", fontSize:"20px"}}>{timerHours == "NaN" ? '00': timerHours}</div>
              <div>
                <span style={{paddingLeft:"0px", fontSize:"18px"}}>:</span>
              </div>
            <div className="col-1" style={{paddingLeft:"0px", paddingRight:"0px", fontSize:"20px"}}>{timerMinutes == "NaN" ? '00': timerMinutes}</div>
              <div>
                <span style={{paddingLeft:"0px", fontSize:"18px"}}>:</span>
              </div>
            <div className="col-1" style={{paddingLeft:"0px", paddingRight:"0px", fontSize:"20px"}}>{timerSeconds == "NaN" ? '00': timerSeconds}</div>
          </div>
          <div className="row justify-content-center">
            <h6 role="heading" aria-level={2} style={{fontSize:"12px", width:"25%", paddingLeft:"10px"}}>{titulo[0]}</h6>
          </div>
         </div>
      </div>
    </>;

  return (<>
    {
      distances <= 0
        ?
        <></>
        :
        event
    }

  </>);
};
