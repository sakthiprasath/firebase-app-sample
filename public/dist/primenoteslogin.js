(()=>{class e{on_auth_state_change(){firebase.auth().onAuthStateChanged((function(e){if(null!=e){let i={email:e.email,displayName:e.displayName,photoURL:e.photoURL,uid:e.uid},a=e.email_verified;console.log("email verified : ",a),sessionStorage.setItem("primenotes-user-data",JSON.stringify(i))}}))}login(){var e={privacyPolicyUrl:"<your-privacy-policy-url>",signInSuccessUrl:"../index.html",signInOptions:[firebase.auth.GoogleAuthProvider.PROVIDER_ID],tosUrl:"../index.html"};return new firebaseui.auth.AuthUI(firebase.auth()).start("#firebaseui-auth-container",e)}logout(){firebase.auth().signOut().then((function(){console.log("success"),window.location.replace("../index.html")}),(function(){}))}init(){this.firebase_config={apiKey:"AIzaSyApJRgVPBvyx7VQOcGdPPm_5NlgKVJEtX0",authDomain:"primenotes-17aa2.firebaseapp.com",databaseURL:"https://primenotes-17aa2-default-rtdb.europe-west1.firebasedatabase.app",projectId:"primenotes-17aa2",storageBucket:"primenotes-17aa2.appspot.com",messagingSenderId:"769006089587",appId:"1:769006089587:web:90c4b0595e89dd195f8106",measurementId:"G-WDC2R9TFPX"},firebase.initializeApp(this.firebase_config),this.firebase=firebase,this.on_auth_state_change(),this.login()}}$(document).ready((function(){(new e).init()}))})();