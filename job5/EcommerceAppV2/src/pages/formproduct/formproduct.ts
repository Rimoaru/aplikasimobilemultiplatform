import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { Product } from '../../models/product/product-model';
import { ProductProvider } from '../../providers/product/product';
import { AlertProvider } from '../../providers/alert/alert';


/**
 * Generated class for the FormproductPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-formproduct',
  templateUrl: 'formproduct.html',
})
export class FormproductPage {

  //deklarasi variabel bertipe string agar judul di form
  //bisa menyusaikan antara tambah data dan update
  judul='';
  //sama seperti judul
  btnLabel='';
  //variable bertipe any untuk menampung
  //hasil dari end point
  response: any;
  //membuat object dari model Product
  product = new Product();
  //deklarasi variabel array untuk menampung hasil category
  //dari end point
  category=[];




  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCtrl : ViewController,
    private productProvider: ProductProvider,
    private alertProvider: AlertProvider,
    private event: Events) {
  }

  ionViewDidLoad() {
    this.category=[];
    this.showCategory();
    //mengganti judul form dan label tombol
    this.judul = "Add Product";
    this.btnLabel = "Save";
    //mengecek apakah ada data yang dikirim
    //dari MyproductPage, jika ada maka
    //akan menampilkan form update beserta datanya
    if(this.navParams.data.id){
      this.judul = "Update Product";
      this.btnLabel = "Update";
      this.showSelectedProduct(this.navParams.data.id)
    }
  }


  //fungsi untuk mengambil categori dari end point
  showCategory() {
    this.productProvider.getCategoryProduct().subscribe(
      result => {
        this.response = result;
        var data = this.response.data;
        data.forEach(element => {
          this.category.push(element);
        });
      }
    )
  }
  
  //fungsi untuk mengambil 1 data yang dipilih
  //berdasarkan id yang dilewatkan
  showSelectedProduct(id:number){
    this.productProvider.getSelectedProduct(id).subscribe(
      result => {
        this.response = result;
        let data = this.response.data;
        this.product.name = data.name;
        this.product.price = data.price;
        this.product.categori_id = data.kategori.id;
        this.product.id = data.id;
        if(data.active==2)
          this.product.active = true;
        this.product.image = data.image;
      }
    );
  }
  
  //fungsi untuk menangani aksi simpan dan update
  save(aksi:any){
    //jika nilai aksi='Save' maka aksi simpan yang dijalankan
    if(aksi=="Save"){
      this.productProvider.saveProduct(this.product).subscribe(
        result => {
          this.alertProvider.showToast("Simpan data berhasil");
          //untuk mengirim/publish event bahwa simpan berhasil
          this.event.publish('save:success');
          //untuk menutup form product
          this.viewCtrl.dismiss();
        },
        error => {
          this.alertProvider.showToast("Simpan data gagal");
        }
      );
      //jika nilai aksi='Update' maka aksi update data yang dijalankan
    } else if (aksi=="Update"){
        this.productProvider.updateProduct(this.product).subscribe(
          result => {
            this.alertProvider.showToast("Update data berhasil");
            //untuk mengirim/publish event bahwa update berhasil
            this.event.publish('save:success');
            //untuk menutup form product
            this.viewCtrl.dismiss();
          },
          error => {
            this.alertProvider.showToast("Update data gagal");
          }
        );
    }
  }

}
