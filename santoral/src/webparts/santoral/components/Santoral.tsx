import * as React from 'react';
import "@pnp/polyfill-ie11";
import { sp } from "@pnp/sp";
import {Web} from "@pnp/sp/webs";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import 'bootstrap/dist/css/bootstrap.min.css';
import "@pnp/sp/profiles";
import "@pnp/sp/site-users/web";
import { ISantoralProps } from './ISantoralProps';
import { GiAngelOutfit } from "react-icons/gi";
import { IconContext } from "react-icons";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

export interface  getSantoral {
  Nombre:string;
}

interface IPnpstate {
  Estado: getSantoral[];
}

export default class Santoral extends React.Component<ISantoralProps, {}> {

  constructor(prop: ISantoralProps) {
    super(prop);
    this.state = {
      Estado: []
    };
  }
  public async componentDidMount() {
    this.getSantoral();
  }

  public render(): React.ReactElement<ISantoralProps> {
    return (<App bindoutput={this.state} />);
  }

  public getSantoral(): Promise<getSantoral[]>{
    return new Promise<getSantoral[]>(async (resolve, reject) => {
    let santoral: getSantoral[] = [];

    var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    var hoy = new Date();

    const w = Web("https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/");
    const r = await w.lists.getByTitle("Santoral").items
      .select("ID","Dia","Mes","Title")
      .filter("Mes eq " + "'" + meses[hoy.getMonth()] + "' and Dia eq " + "'" + hoy.getDate() + "'")
      .get();
    r.map((dato) => {

      santoral.push({Nombre: dato.Title});
      this.setState({Estado: santoral});
      resolve(santoral);
    });
    });
  }
}

function App(props) {

  const Bindvalue = props.bindoutput.Estado.map((Outfile) =>
        <>
          <div className="row">
            <div className="col col-lg-7">
              <h5 className="card-title">{Outfile.Nombre}</h5>
            </div>
            <div className="col col-lg-2">
              <IconContext.Provider value={{size:'3em' }}>
                <div>
                  <GiAngelOutfit />
                </div>
              </IconContext.Provider>
            </div>
          </div>
        </>
    );

  return (<>
    <span role="heading" aria-level={2} style={{fontSize:"28px", color:"#c00518"}} >Santoral de Hoy</span>
    <div className="card" style={{width: "100%"}}>
      <div className="card-body">
        {Bindvalue}
      </div>
    </div>
  </>);
}
