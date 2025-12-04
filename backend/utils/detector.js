export function analyzeHttpEvent({ url = "", rawRequest = "", statusCode = 0 }) {
  const text = `${url} ${rawRequest}`;
  const patterns = [
    [/union.*select/i,"SQL Injection","HIGH"],
    [/select.*from/i,"SQL Injection","HIGH"],
    [/onerror=/i,"XSS","HIGH"],
    [/onload=/i,"XSS","HIGH"],
    [/\.\.\//,"Directory Traversal","HIGH"],
    [/localhost|127\.0\.0\.1/i,"SSRF","CRITICAL"]
  ];
  let isAttack=false, attackType="NONE", severity="LOW", isSuccessful=false, reasons=[];
  for (const [p, type, sev] of patterns){
    if(p.test(text)){ isAttack=true; attackType=type; severity=sev; reasons.push(String(p)); }
  }
  if(isAttack && statusCode>=200 && statusCode<400) isSuccessful=true;
  return { isAttack, attackType, severity, isSuccessful, detectionReasons: reasons };
}