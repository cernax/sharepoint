import * as React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ICarouselimageProps } from './ICarouselimageProps';
import * as $ from 'jquery';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { escape } from '@microsoft/sp-lodash-subset';
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import {Web} from "@pnp/sp/webs";

const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1
  }
};

export default class Carouselimage extends React.Component<ICarouselimageProps, any> {

  public constructor(prop) {
    super(prop);
    this.state = {
      loaded: false
    };
  }

  public render(): React.ReactElement<ICarouselimageProps> {

    return (
      <>
        <Carousel responsive={responsive}>
          <div><img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/img (36).jpg" alt="Card image cap" /></div>
          <div><img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/img (35).jpg" alt="Card image cap" /></div>
          <div><img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/img (34).jpg" alt="Card image cap" /></div>
          <div><img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/img (33).jpg" alt="Card image cap" /></div>
          <div><img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/img (29).jpg" alt="Card image cap" /></div>
          <div><img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/img (31).jpg" alt="Card image cap" /></div>
          <div><img className="card-img-top" src="https://mdbootstrap.com/img/Photos/Others/img (30).jpg" alt="Card image cap" /></div>
        </Carousel>
      </>
    );
  }
  private async getImage() {
    const w = Web("https://euroamerica.sharepoint.com/sites/MundoEuronetDesa/");
    const r = await w.lists.getByTitle("Comments").items
      .select("ID", "Body", "Autor", "Title", "Url", "Created", "TipoComments", "Idrelacionado")
      .top(15)
      .orderBy("Created", false)
      .get()
      .then()
      .catch();
  }
}
