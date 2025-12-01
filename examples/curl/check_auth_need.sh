curl -X POST "http://localhost:8000/check_auth_need" \
     -H "Content-Type: application/json" \
     -d '{
           "payer": "MockHealth",
           "code": "J9312",
           "diagnosis": "Non-small cell lung cancer",
           "stage": "Stage IV",
           "clinical_note": "Patient has progressed on prior therapy."
         }'
