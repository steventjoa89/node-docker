CREATE DEPLOYMENT MANUAL
- kubectl create deployment nginx-depl --image=nginx

SHOW ALL DEPLOYMENT:
- kubectl get deployment
SHOW ALL POD:
- kubectl get pod
SHOW ALL REPLICA:
- kubectl get replicaset

EDIT DEPLOYMENT:
- kubectl edit deployment nginx-depl

SHOW LOGS:
- kubectl logs <podname>

SHOW IMPORTANT DESCRIPTION WITHIN PODS:
- kubectl describe pod <podname>
