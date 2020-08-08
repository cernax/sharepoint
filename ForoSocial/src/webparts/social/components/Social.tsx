import * as React from 'react';
import "@pnp/polyfill-ie11";
import { ISocialProps } from './ISocialProps';
import 'bootstrap/dist/css/bootstrap.min.css';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/site-users/web";
import {Web} from "@pnp/sp/webs";
import "@pnp/graph/users";
import {FiArrowRightCircle} from 'react-icons/fi';
import * as $ from 'jquery';
import { Spinner } from "react-bootstrap";
import Tooltip from "@material-ui/core/Tooltip";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { sp, PrincipalSource, PrincipalType } from "@pnp/sp";
import "@pnp/sp/profiles";

sp.setup({
  // set ie 11 mode
  ie11: true,
});

export interface  getparametros {
  id:number;
  created:string;
  Comment:string;
  author:string;
  titulo:string;
  imguser:string;
  url:string;
  contador:number;
}
export interface  getparametrosforo {
  id:number;
  created:string;
  Comment:string;
  author:string;
  titulo:string;
  imguser:string;
  url:string;
  contador:number;
}
export interface  Comments {
  id:number;
  created:string;
  Comment:string;
  author:string;
  titulo:string;
  imguser:string;
  url:string;
  contador:number;
}
const HtmlTooltip = withStyles((theme) => ({
  tooltip: {
    maxWidth: 500,
    fontSize: theme.typography.pxToRem(20),
    border: '1px solid #dadde9',
  },
}))(Tooltip);

export default class Social extends React.Component<ISocialProps, any> {

  public constructor(prop) {
    super(prop);
    this.state = {
      CommentariosNews:[],
      CommentariosForos:[],
      Comments:[],
      ciclo:0,
      loaded: false,
    };
  }
  public async componentDidMount() {

    await this.getallscommt();
  }

  public render(): React.ReactElement<ISocialProps> {

    return (
      <>
        <span role="heading" aria-level={2} style={{fontSize:"28px", color:"#c00518"}}>Social</span>
        <div className="card" style={{width: "100%"}}>
          <div className="card-body">
            <div style={{height:"235px", width:"100%", overflowY:"scroll", overflowX:"hidden" }}>
              {
                this.state.ciclo == 0 ?
                  <div style={{textAlign: "center", backgroundColor: "rgba(0, 0, 0, .3)", width:"100%", height:"100%"}}>
                    <div  style={{paddingTop:"13%"}}>
                      <div>
                        <Spinner animation="border" style={{color:"white"}} role="status">
                          <span className="sr-only">Loading...</span>
                        </Spinner>
                      </div>
                      <div>
                        <span style={{color:"white"}}>Cargando</span>
                      </div>
                    </div>
                  </div>
                  :
                  this.state.CommentariosForos.map(tit => {
                    return <>
                      <table>
                        <tr>
                          <td>
                            <img src={tit.imguser == '' ? 'https://euroamerica.sharepoint.com/:i:/s/MundoEuronetDesa/EV7m3pYHdbdKpEbBdhktb6gBpru4QgjOZeTan85DrUFJMA?e=k6bviV': tit.imguser} alt="img user" width="40px" style={{borderRadius:"20px"}} />
                          </td>
                          <td>
                            <a style={{color:'rgb(0, 0, 0)', textDecoration: 'none'}} href={tit.url} >
                              <HtmlTooltip title={<div dangerouslySetInnerHTML={{__html: tit.Comment}}/>}  placement="right" arrow={true} >
                                <div>
                                  <div style={{width:"100%"}}>
                                    <h5 className="" style={{maxWidth: "calc(18vw - 80px)", flex:1, whiteSpace: "nowrap",overflow: "hidden",textOverflow: "ellipsis"}}  >{tit.titulo} {tit.contador == 0 ? <></> : <span>({tit.contador})</span>}</h5>
                                  </div>
                                  <div style={{width:"100%", height:"23px"}}>
                                    <h6 className="card-subtitle mb-2 text-muted text-truncate" style={{maxWidth: "calc(18vw - 80px)", display:"inline-block"}} dangerouslySetInnerHTML={{__html: tit.Comment}}/>
                                  </div>
                                </div>
                              </HtmlTooltip>
                            </a>
                          </td>
                        </tr>
                      </table>
                    </>;
                  })
              }
            </div>
          </div>
          <div style={{textAlign:"right"}}>
            <a href={'https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/foro/Paginas/Foros.aspx'} role="heading" aria-level={2} style={{fontSize:"20px", color:"#c00518"}}>Ir al Foro <FiArrowRightCircle/></a>
          </div>
        </div>
      </>
    );
  }
  private async getallscommt(){

    await this.getComments();

    this.setState({ciclo:1});
  }

  private getCantCommentForo(idforo) {

    var cont = 0;

    $.ajax({
      url: "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/foro/_api/web/Lists/getByTitle('Foros')/items?$filter=ParentItemID eq " + idforo + " &$orderby=Created desc&",
      type: "GET",
      async: false,
      dataType: 'json',
      success: async bodycomment => {
        if (bodycomment.value.length > 0) {

          for (var x = 0; x < bodycomment.value.length; x++) {

            cont++;

            $.ajax({
              url: "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/foro/_api/web/Lists/getByTitle('Foros')/items?$filter=ParentItemID eq " + bodycomment.value[x].Id + " &$orderby=Created desc&",
              type: "GET",
              async: false,
              dataType: 'json',
              success: async bodyrecomment => {

                if (bodyrecomment.value.length > 0) {
                  cont++;
                }
              },
              error: error => {
                console.log("Error: " + error.message);
              }
            });
          }
        }
      },
      error: error => {
        console.log("Error: " + error.message);
      }
    });

    return cont;
  }

  private async getComments(): Promise<void> {
    let Foros: getparametrosforo[] = [];
    var cont = 0;
    var pict = '';
    const w = Web("https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/");
    const r = await w.lists.getByTitle("Comments").items
      .select("ID", "Body", "Autor", "Title", "Url", "Created", "TipoComments", "Idrelacionado")
      .top(15)
      .orderBy("Created", false)
      .get();


    r.map(async resp => {
      try {

        var loginname = encodeURIComponent(resp.Autor);

        $.ajax({
          url: "https://euroamerica.sharepoint.com/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='" + loginname + "'",
          type: "GET",
          async: true,
          dataType: 'json',
          success: async picture => {
            if (picture.PictureUrl == null)
              pict = '';
            else
              pict = picture.PictureUrl;
          },
          error: error => {
            console.log("Error: " + error.message);
          }
        });

        var body = '';

        if(resp.TipoComments == "Foro")
        {
          var idforo = resp.Idrelacionado;

          $.ajax({
            url: "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/foro/_api/web/Lists/getByTitle('Foros')/items?$filter=ParentItemID eq " + idforo + " &$orderby=Created desc&$top=1",
            type: "GET",
            async: true,
            dataType: 'json',
            success: bodycomment => {

              if(bodycomment.value.length > 0) {

                var val = false;
                var resps = bodycomment.value[0];

                $.ajax({
                  url: "https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/foro/_api/web/Lists/getByTitle('Foros')/items?$filter=ParentItemID eq " + resps.ID + " &$orderby=Created desc&$top=1",
                  type: "GET",
                  async: true,
                  dataType: 'json',
                  success: bodyrecomment => {
                    var respres = bodyrecomment.value[0];
                    if (bodyrecomment.value.length > 0) {
                      body = respres.Body;
                      val = true;
                    }
                  },
                  error: error => {
                    console.log("Error: " + error.message);
                  }
                });
                if (val == false)
                  body = resps.Body;
              }
            },
            error: error => {
              console.log("Error: " + error.message);
            }
          });
          body = body == '' ? resp.Body : body;

          cont = this.getCantCommentForo(idforo);
        }
        else {
          cont = 0;
          body = resp.Body;
        }

        Foros.push({
          id: resp.ID,
          created: resp.Created,
          Comment: body,
          author: resp.Autor,
          titulo: resp.Title,
          imguser: pict,
          url: resp.Url,
          contador: cont
        });

      } catch (e) {
        console.log(e);
      }
    });

    this.setState({CommentariosForos: Foros});

    return Promise.resolve();
  }
}

