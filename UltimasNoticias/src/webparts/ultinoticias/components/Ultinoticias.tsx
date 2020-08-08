import * as React from 'react';
import "@pnp/polyfill-ie11";
import { IUltinoticiasProps } from './IUltinoticiasProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import { IconContext } from "react-icons";
import { BsNewspaper } from 'react-icons/bs';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Web } from "@pnp/sp/webs";
import { sp } from "@pnp/sp";
sp.setup({
  // set ie 11 mode
  ie11: true,
});


export interface  urlimg {
  urlimge: string;
  titulo: string;
  path:string;
}

interface IPnpstate {
  ImageUrl: urlimg[];
}


export default class Ultinoticias extends React.Component<IUltinoticiasProps, IPnpstate> {

  private async  GetDato(): Promise<urlimg[]>{
    return new Promise<urlimg[]>(async (resolve, reject) => {
    let noticias: urlimg[] = [];

    const w = Web("https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/noticias/");
    const r = w.lists.getByTitle("Páginas del sitio").items
      .select("ID", "ContentTypeId", "EncodedAbsUrl", "Title", "CanvasContent1")
      .top(3)
      .orderBy("Created", false)
      .filter("Principal eq 0 and Title ne null and Publicado eq 1")
      .get();
    r.then(responses => {
      const result = responses;
      result.map((dato) => {
        if(dato.ID != 1)
        {
          var img ="/sites/MundoEuronetDesa/PublishingImages/NOTICIAS/2020/Azul%20Casa%20Cambio%20de%20Domicilio%20Tarjeta%20(1).png?&originalPath=aHR0cHM6Ly9ldXJvYW1lcmljYS5zaGFyZXBvaW50LmNvbS86aTovcy9NdW5kb0V1cm9uZXREZXNhL0VjR0ktVnBob3JoRXBUbDdWb1lVcFM0Qm1MYV9WZ01rYzdFdFhCUDdRb3dGT2c_cnRpbWU9NzJuOTdGWU8yRWc";
          try {

            img = dato.CanvasContent1.split('src="')[1].split('"')[0];
          }
          catch (error) {
            img = "/sites/MundoEuronetDesa/PublishingImages/NOTICIAS/2020/Azul%20Casa%20Cambio%20de%20Domicilio%20Tarjeta%20(1).png?&originalPath=aHR0cHM6Ly9ldXJvYW1lcmljYS5zaGFyZXBvaW50LmNvbS86aTovcy9NdW5kb0V1cm9uZXREZXNhL0VjR0ktVnBob3JoRXBUbDdWb1lVcFM0Qm1MYV9WZ01rYzdFdFhCUDdRb3dGT2c_cnRpbWU9NzJuOTdGWU8yRWc";
          }
          noticias.push({
            urlimge: "https://euroamerica.sharepoint.com" + img,
            titulo: dato.Title,
            path: dato.EncodedAbsUrl
          });
        }

      });
      this.setState({ImageUrl:noticias});
      });
    });
  }

  constructor(prop:IUltinoticiasProps){
    super(prop);
    this.state = {
      ImageUrl: []
    };
  }

  public  componentDidMount(){
    this.GetDato();
  }

  public render(): React.ReactElement<IUltinoticiasProps> {
    return (
      <div>
        { this.state.ImageUrl.length > 0 && <UltimasNoticias bindoutput={this.state} /> }
      </div>
    );
  }

}
const UltimasNoticias = (props) => {

  const Bindvalue = props.bindoutput.ImageUrl.map((Outfile) =>
    <a className="blockLink" style={{display: "contents"}} href={Outfile.path}>
      <div className="card mb-3" style={{maxWidth: "540px;", height: "137px"}}>
      <div className="row no-gutters">
        <div className="col-md-4" style={{height: "135px"}}>
          <img src={Outfile.urlimge} style={{height:"100%", width:"100%"}} className="card-img" alt="imagen" />
        </div>
        <div className="col-md-8" style={{textOverflow: "ellipsis", overflow: "hidden", height: "135px"}}>
            <h5 className="card-title"><a className="container" style={{color:"rgb(0, 0, 0)"}} href={Outfile.path}>{Outfile.titulo}</a></h5>
            <p className="card-text" dangerouslySetInnerHTML={{__html: Outfile.descrip}} />

        </div>
      </div>
    </div>
    </a>
  );
  const MAslider = (
    <div>
      <div className="row">
        <div className="col col-lg-12">
          <span role="heading" aria-level={2} style={{fontSize:"28px", color:"#c00518"}}>Últimas Noticias</span>
          <a className="blockLink" style={{display: "contents"}} href="https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/noticias/SitePages/Forms/AllPages.aspx">
            <span style={{color:'#c00518', fontSize:'18px', paddingLeft: "1%", width:"133px", textAlign:"end"}}>ir a las noticias &nbsp; </span>
            <IconContext.Provider value={{ color: "black", className: "global-class-name", size: "2em" }}>
              <BsNewspaper />
            </IconContext.Provider>
          </a>
        </div>
      </div>
      {Bindvalue}
    </div>
  );
  return (
    <>
      {MAslider}
    </>
  );
};
