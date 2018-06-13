// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
// ver aca para las instrucciones de como configurar el nodeemailer
// https://github.com/firebase/functions-samples/blob/master/email-confirmation/README.md
// aca esta el repo
// https://github.com/firebase/functions-samples/blob/master/email-confirmation/functions/index.js
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
// import * as nodemailer from 'nodemailer';
// import * as Styliner from 'styliner';
// import * as fs from 'fs';
// admin.initializeApp();
// const gmailEmail = functions.config().gmail.email;
// const gmailPassword = functions.config().gmail.password;
// const mailTransport = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: gmailEmail,
//     pass: gmailPassword,
//   },
// });
// const styliner = new Styliner(__dirname + '/html');
// export const sendEmail = functions.database.ref(`/crm/printPsp/{pspSendId}`)
// .onWrite( (change, context) => {
//   console.log(change.after.val(), context.params.pspSendId);
//   const psp = change.after.val();
//   const mailOptions = {
//     from: '"Quadri" <info@quadri.com.ar>',
//     cc: psp.cc,
//     to: psp.to,
//     subject: `Quadri - Presupuesto ${psp.number}`,
//     text: 'Version texto',
//     html: `
//     <p>${psp.obs}</p>
//     <br>
//     <p style="color:blue;margin-left:30px;">Cliente: ${psp.razSoc}</p>
//     <p>Fecha: ${psp.date}</p>
//     `
//   };
//   const originalSource = fs.readFileSync(__dirname + '/html/psp-email.html', 'utf8');
//   fs.readFile(__dirname + '/html/psp-email.html', 'utf8', (err, data) => {
//     console.log(__dirname + '/html/psp-email.html');
//     if (err) {
//       console.log(err)
//       return ;
//     }
//     styliner.processHTML(data)
//     .then( processedSource => {
//       console.log(processedSource);
//       const mailOptions = {
//         from: '"Quadri" <info@quadri.com.ar>',
//         cc: psp.cc,
//         to: psp.to,
//         subject: `Quadri - Presupuesto ${psp.number}`,
//         text: 'Version texto',
//         html: processedSource
//         };
//         return mailTransport.sendMail(mailOptions).then(() => {
//           console.log('Psp sent');
//         }).catch(error => {
//           console.error('There was an error while sending the email:', error);  
//         });
//     });
//   })
// })
//# sourceMappingURL=index.js.map