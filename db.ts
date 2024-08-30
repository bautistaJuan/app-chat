import * as admin from "firebase-admin";
// const serviceAccount = require("./key.json");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "dwf-chat",
    private_key_id: "aec68c3c4c424f56aa70a18bed3574da15d56630",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDLSb5QMx7dsJv/\nSU+uovMiwA24kw2OiUav6m7ZAW1sSbf6dGNTnfeY+dIMswx6jrALkgZnOOve20bL\n2ZHXwI0HOR94s7pOQn1H3YieqD+nc4rgXE1A0hs6k+oEXDH4A7U0rnsUxbrwnaxA\nygq2qeUaNUG5TNJGdzska6Caw62tororWscgyChGIaVjLnW6xF77Lzl8s2e3iI5r\nrCmmTuptCMS3rDCT0zQCZWoeF5lgKN95GwK0uAlFSjqMqXQtjoLHwDeUc+EbmNAJ\ncmlsZrj2pDLZYjlIppwk7Txy514/iZOZUHAmwRhcnQXU6y1RtSBlrpzEVwWbZeeB\n51+p4sfRAgMBAAECggEACGvuqW3kunRlkgbceTSg8/CW4O2eoygGuKTyoKTRfqnz\nKDoIH1+s8TZwQDxuqOkeW+xZvY77Holg/nLt+s0sSn9QUXTIpBNXE1IXJdN8h5he\nyXqpbKUHob6c9D9JhqfIqv0LdknWu78ccrasCPMy3YoVRfLrxyWLWq/mwGKY4FeJ\ngADTbFO5Vy8JUCi+tjxgqaidhZZKamAvKt3H0/k4gaNdwoxWJLfex4ht0zFV+nnd\n4OYEVxMU9VfrmqYvUSw20wU9UCkF9g7nXosOCPtXSv/JLXNVwkUTax0bLaJdULmP\nxBFBET8d0ZoeiuUcMhMIqUmB+kAaGP2zGhHObruT/QKBgQD2NyNM3vIha4NkF2np\n8McOKm+IKiFMsqkvUupAnyChLXSWjBA9SBN43nkkFmWvEba8tVDLmvgubcE7kFRQ\nwE4Nzjdx/qEsIqE1ccLpos9WH5v1wnS/KeAzgQx9NCznrgw9yLvqkbox7TQfJi9A\n/K+aSpQ1tK4qtBM0nGLGEgKMcwKBgQDTXeLbvVflk/VtZ9xp8LwTbbeRDlJdVkiM\niknoG7tM2D94MmOX7DscaRzk2gsBDFzK6GJ5AFhqH8YB2uERwrk+c9LaYsep1qh0\nFGR7usCQukQYw+c77OkjITxGq927lLUD0Qy651NdLJA08VYUk7QU1Qds1fIuP4EU\nytefe5ZtqwKBgCsAWkP0tCkuE9aJWFApYzqQIsaPRR2WHoJLYupCYHqF69TXRYbO\nbcgwYsvwtXWsDFRM/n1w5WOGe7chb/hifb9fgsOACzogGjOxWK9hZgDOqHh1q9ov\nQB7+rOW5FRapiS3JPziqlvBdUzsVei9Jconp+JSgp8KBjNEldwLM5nENAoGAJPNX\n0nRiZlccY7jxdm/IYVkf6zLmwTxxSGhwjSwz7TYsulWMxaVdnBTgIT3hCJjhq/M+\nK8scqcjOM8rQ5+rzuXBEHzt/jjhhkJF0E5FNUr/NYcr1pKtBAowv3mbzR3SyxG0K\nXa5NC4/b0fWSx9wecjnfp24rfVxKs5jWYyIW5SsCgYEAkvXLcg7uSAgkPQt4/6n+\ntJRxovK2w/uNKGv57yxACXk/33o+I+gUPceUHEOBM8qSZr7iDq7GJJa2kKXAGlOp\nWnhFFhOUr3EfHX2EMbdOHZvjmT0MsnW3cHN+NCMK9xv0b8UnS13Y/G91Uc5K/2Rj\nEM3ok7qwrS/fyj6GZQcHMuI=\n-----END PRIVATE KEY-----\n",
    client_email: "firebase-adminsdk-xk72u@dwf-chat.iam.gserviceaccount.com",
    client_id: "116120061501050994647",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xk72u%40dwf-chat.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  } as any),
  databaseURL: "https://dwf-chat-default-rtdb.firebaseio.com/",
});

const firestore = admin.firestore();
const rtdb = admin.database();

export { firestore, rtdb };
