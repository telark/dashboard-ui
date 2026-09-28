import type { InsightKind } from '../models';
import type { InsightReason } from './insights';

export interface InsightGuidance {
  cause: string;
  steps: readonly string[];
}

// Why / What to do per reason. Placeholders are the card's params keys.
export const INSIGHT_GUIDANCE: Record<InsightReason, InsightGuidance> = {
  'image_pull.not_found': {
    cause:
      'The image {image} does not exist in {registry}: the tag was never pushed, was deleted, or the name is misspelled.',
    steps: [
      'Compare the image of {workload} (containers → image) with the tags published in {registry}.',
      'Push the missing tag, or change the image to a tag that exists.',
    ],
  },
  'image_pull.denied_or_missing': {
    cause:
      '{registry} refused the pull. It answers this way both when the repository does not exist and when it is private and no valid pull credentials were sent.',
    steps: [
      'Check that the repository name in {image} is spelled correctly.',
      'If the repository is private, give the workload a pull secret (imagePullSecrets) or attach one to its service account.',
      "Check that the pull secret's registry and credentials are current.",
    ],
  },
  'image_pull.unauthorized': {
    cause:
      '{registry} requires authentication and rejected the credentials sent with the pull (missing, expired or for another registry).',
    steps: [
      'Check the pull secret referenced by {workload} (imagePullSecrets or its service account).',
      'Renew the token or password in that secret, and make sure its server matches {registry}.',
    ],
  },
  'image_pull.registry_unreachable': {
    cause:
      'The node could not connect to {registry}: the host name does not resolve, the network or a firewall blocks it, or the registry is down.',
    steps: [
      'Check that {registry} is spelled correctly and resolves from the cluster.',
      'If the cluster is air-gapped or behind a proxy, use a registry mirror the nodes can reach.',
      "Check the registry's status page if it is a public registry.",
    ],
  },
  'image_pull.invalid_name': {
    cause:
      '{image} is not a valid image reference (for example upper-case letters in the repository, a space, or a malformed tag or digest).',
    steps: [
      'Fix the image of {workload} (containers → image): lower-case repository, tag after :, digest after @sha256:.',
    ],
  },
  'image_pull.rate_limited': {
    cause:
      '{registry} limits how many pulls it accepts from one address or account, and this cluster exceeded the limit.',
    steps: [
      'Authenticate pulls to {registry} with a pull secret (higher limits), or use a registry mirror or cache.',
      'Prefer imagePullPolicy IfNotPresent with a pinned tag so nodes reuse cached images.',
    ],
  },
  'image_pull.other': {
    cause:
      'The pull of {image} failed for a reason the message states but that has no specific guidance.',
    steps: [
      'Read the registry message in Details.',
      "Check the image name, the registry's reachability and the pull credentials of {workload}.",
    ],
  },
  'crashloop.probe_kill': {
    cause:
      'The kubelet restarts a container whose {probe} probe keeps failing. Either the application is not answering the probe, or the probe starts too early or allows too little time.',
    steps: [
      'Check the {probe} probe of {workload} (containers → {probe}Probe): path, port and timeouts must match what the application serves.',
      'If the application needs time to start, add a startup probe instead of a longer liveness delay.',
      'Read the container logs from before the restart.',
    ],
  },
  'crashloop.init_failure': {
    cause:
      'Pods start only after every init container succeeds; {container} keeps exiting with an error.',
    steps: [
      'Read the logs of the init container {container}.',
      'Check what it waits for or prepares (a database, a migration, a file) and whether that dependency is reachable.',
    ],
  },
  'crashloop.start_error': {
    cause:
      'The container runtime could not start the command: the executable does not exist in the image or is not executable.',
    steps: [
      'Check the command and args of {workload} (containers → command) against the files in the image.',
      'If the image changed recently, check that its entrypoint still exists.',
    ],
  },
  'crashloop.exit_0': {
    cause:
      'The process completed successfully and exited, but a Deployment, StatefulSet or DaemonSet expects a process that keeps running.',
    steps: [
      'Make the container run a long-lived process (a server, a worker loop) rather than a one-off command.',
      'If this is a one-off task, run it as a Job instead.',
    ],
  },
  'crashloop.exit_1': {
    cause:
      'Exit code 1 is a general application error: the program started and then stopped on an error it reported in its logs.',
    steps: [
      'Read the container logs from the last restart: the error is usually on the last lines.',
      'Check recent configuration: environment variables, mounted files and the services it connects to.',
    ],
  },
  'crashloop.exit_126': {
    cause:
      'Exit code 126 means the shell found the command but could not execute it (missing execute permission or wrong binary format).',
    steps: [
      "Check the command of {workload}: the file must be executable and built for the node's architecture.",
    ],
  },
  'crashloop.exit_127': {
    cause:
      'Exit code 127 means the shell could not find the command: a typo, a missing binary in the image, or a PATH that does not contain it.',
    steps: [
      'Check the command and args of {workload} for typos.',
      'Check that the image contains that binary (it may have been removed in a newer image).',
    ],
  },
  'crashloop.exit_137': {
    cause:
      'Exit code 137 means the process was killed with SIGKILL. The usual causes are the memory limit (the kernel did not report it as OOMKilled), a failed liveness probe, or the process killing itself.',
    steps: [
      "Compare the container's memory usage with its limit on the application page.",
      'Check the liveness probe of {workload}.',
      'Read the logs from before the restart.',
    ],
  },
  'crashloop.exit_139': {
    cause:
      'Exit code 139 means the process accessed invalid memory (SIGSEGV): a bug, a corrupted binary or a native library built for another platform.',
    steps: [
      'Check whether the image changed recently and roll back if so.',
      'Check that the image matches the node architecture.',
    ],
  },
  'crashloop.exit_143': {
    cause:
      'Exit code 143 means the process received SIGTERM and stopped. Something is asking it to stop: a failing probe, a shutdown hook, or the process signalling itself.',
    steps: ['Check the probes of {workload}.', 'Read the logs just before the stop.'],
  },
  'crashloop.exit_other': {
    cause: "The container keeps exiting with code {exitCode}; the application's logs state why.",
    steps: [
      'Read the container logs from the last restart.',
      'Check the documentation of the application for exit code {exitCode}.',
    ],
  },
  'oom.limit': {
    cause: 'The container needed more memory than its limit of {limit}, so the kernel killed it.',
    steps: [
      'Raise the memory limit of {container} in {workload} (containers → resources.limits.memory) above its peak usage.',
      "If usage keeps growing, look for a memory leak or lower the application's cache/heap settings.",
    ],
  },
  'oom.node': {
    cause:
      'The node ran out of memory and the kernel killed this container. Without a memory limit it can use memory other pods need.',
    steps: [
      'Set memory requests and limits on {container} in {workload}.',
      "Check the node's memory use on the cluster: other workloads may be using more than they request.",
    ],
  },
  'probe_failure.readiness': {
    cause: 'The readiness probe decides whether a pod receives traffic. {failureCause}',
    steps: [
      'Check the readiness probe of {workload} (containers → readinessProbe) against the port and path the application serves.',
      'If the application is slow to answer, raise timeoutSeconds or failureThreshold.',
      'If it depends on another service, check that service.',
    ],
  },
  'probe_failure.liveness': {
    cause: 'The liveness probe decides whether a container is restarted. {failureCause}',
    steps: [
      'Check the liveness probe of {workload} (containers → livenessProbe).',
      'Do not make liveness depend on other services: a dependency outage would restart every pod.',
    ],
  },
  'probe_failure.startup': {
    cause:
      'The startup probe gives a slow application time to start; it is failing before the application is ready. {failureCause}',
    steps: [
      'Raise failureThreshold × periodSeconds of the startup probe of {workload} to cover the real start time.',
      'Check the port and path it probes.',
    ],
  },
  'scheduling.insufficient_cpu': {
    cause: "No node has enough unreserved CPU for the pod's CPU request.",
    steps: [
      'Lower the CPU request of {workload} if it is higher than it needs (see its recommendations).',
      'Or add node capacity, or free CPU by scaling down other workloads.',
    ],
  },
  'scheduling.insufficient_memory': {
    cause: "No node has enough unreserved memory for the pod's memory request.",
    steps: [
      'Lower the memory request of {workload} if it is higher than it needs.',
      'Or add node capacity.',
    ],
  },
  'scheduling.taints': {
    cause:
      'The nodes carry taints and the pod has no matching toleration, so it may not run there.',
    steps: [
      'Check which taints the nodes carry and whether {workload} should run there.',
      'If it should, add the matching tolerations to {workload}; otherwise add untainted capacity.',
    ],
  },
  'scheduling.node_affinity': {
    cause: "The pod's nodeSelector or node affinity names labels no schedulable node has.",
    steps: [
      "Compare the nodeSelector / node affinity of {workload} with the labels of the cluster's nodes.",
      'Fix the label in the workload, or label the intended nodes.',
    ],
  },
  'scheduling.pod_anti_affinity': {
    cause:
      'Required pod (anti-)affinity rules forbid every node: for example more replicas than nodes with a one-pod-per-node rule.',
    steps: [
      'Change the required anti-affinity of {workload} to preferred, or lower replicas to the number of eligible nodes.',
      'Or add nodes.',
    ],
  },
  'scheduling.topology_spread': {
    cause:
      'A topology spread constraint with whenUnsatisfiable: DoNotSchedule cannot be met with the current nodes.',
    steps: [
      'Relax maxSkew or use whenUnsatisfiable: ScheduleAnyway in {workload}, or add nodes in the missing zone/host.',
    ],
  },
  'scheduling.volume': {
    cause:
      'A PersistentVolumeClaim the pod uses is not bound (no matching storage class or volume) or its volume lives in a zone the pod cannot run in.',
    steps: [
      'Check the claims of {workload}: the storage class must exist and be able to provision.',
      "For a zonal volume, run the pod in the volume's zone.",
    ],
  },
  'scheduling.too_many_pods': {
    cause: 'Every node has reached its maximum number of pods.',
    steps: ['Add nodes or larger nodes, or reduce the number of pods (replicas, completed Jobs).'],
  },
  'scheduling.host_ports': {
    cause:
      'The pod asks for a host port (or host networking) that is already used on every eligible node.',
    steps: [
      'Remove hostPort / hostNetwork from {workload} unless it is required, and expose it with a Service instead.',
      'Or run at most one replica per node.',
    ],
  },
  'scheduling.other': {
    cause: 'The scheduler found no node for the pod; its message lists the reasons per node.',
    steps: [
      'Read the scheduler message in Details and adjust the requests, node rules or capacity it names.',
    ],
  },
  'resource_pressure.evicted_memory': {
    cause:
      'The node ran out of memory and evicted pods, starting with those using more than they request.',
    steps: [
      'Set the memory request of {workload} close to its real usage so it is not first in line.',
      "Check the node's memory use across workloads.",
    ],
  },
  'resource_pressure.evicted_ephemeral': {
    cause:
      'The pod wrote more to its local storage (logs, emptyDir, container filesystem) than its limit or the node allowed.',
    steps: [
      'Find what writes to local disk in {workload} (logs, temp files, caches) and bound it.',
      'Set ephemeral-storage requests/limits or an emptyDir sizeLimit that match the real need.',
    ],
  },
  'resource_pressure.evicted_disk': {
    cause: "The node's disk filled up and the kubelet evicted pods to recover space.",
    steps: ['Check the node disk usage (images, logs) and the local storage use of {workload}.'],
  },
  'resource_pressure.evicted_pid': {
    cause: 'Too many processes run on the node; the kubelet evicted pods.',
    steps: [
      'Check whether {workload} spawns processes without bound (a fork loop, a thread leak).',
    ],
  },
  'resource_pressure.preempted': {
    cause:
      'The scheduler preempted this pod because a pod with a higher priority class needed its node.',
    steps: [
      'If {workload} is critical, give it an appropriate priorityClassName.',
      'Or add capacity so preemption is not needed.',
    ],
  },
  'resource_pressure.other': {
    cause: 'The kubelet evicted the pod; the message names the resource.',
    steps: ['Read the eviction message in Details.'],
  },
  'rollout_stuck.progress_deadline': {
    cause:
      "The new version's pods did not become ready within progressDeadlineSeconds, so the rollout is marked as failed and stays half-way.",
    steps: [
      'Look at the new pods of {workload}: why are they not ready (pending, starting, failing checks)?',
      'Fix the new version, or roll back to the previous snapshot from the Snapshots section (Manage Snapshots).',
    ],
  },
  'rollout_stuck.quota_exceeded': {
    cause:
      'A ResourceQuota in the namespace forbids creating more pods or reserving more resources.',
    steps: [
      'Ask the namespace owner to raise the quota, or lower the replicas or requests of {workload} to fit it.',
    ],
  },
  'rollout_stuck.admission_denied': {
    cause:
      'An admission policy rejected the pods — for example a protection plan in enforce mode, or another policy on the cluster.',
    steps: [
      'Read the policy message in Details: it names the rule that failed.',
      'Change {workload} to satisfy the rule, or ask the owner of the policy for an exception.',
    ],
  },
  'rollout_stuck.incomplete': {
    cause: 'The new version is not fully rolled out yet and no failure was reported.',
    steps: ['Wait a few minutes; if it does not progress, look at the new pods of {workload}.'],
  },
  'config_change_regression.image': {
    cause:
      'The workload degraded shortly after its image changed, and no more specific symptom was found.',
    steps: [
      'Compare the new image with the previous one; roll back to the snapshot before gen {generation} if the new version is faulty.',
    ],
  },
  'config_change_regression.config': {
    cause: 'The workload degraded shortly after its configuration changed.',
    steps: [
      'Review the change of gen {generation} in History Changes; roll back to the snapshot before it from the Snapshots section if it caused the problem.',
    ],
  },
  'config_change_regression.resources': {
    cause: 'The workload degraded shortly after its requests or limits changed.',
    steps: [
      'Check that the new requests still fit on the nodes and the new limits cover peak usage; roll back if not.',
    ],
  },
  'config_change_regression.other': {
    cause: 'The workload degraded shortly after a change.',
    steps: ['Review the change of gen {generation} in History Changes.'],
  },
  'other.container_config_error': {
    cause:
      'The container references a ConfigMap, Secret or key (env valueFrom, envFrom) that does not exist in the namespace, so it cannot be created.',
    steps: [
      'Check every configMapKeyRef, secretKeyRef, envFrom of {workload} against the ConfigMaps and Secrets of the namespace.',
      'Create the missing object/key, or mark the reference optional if it may be absent.',
    ],
  },
  'other.create_container_error': {
    cause:
      'The container runtime refused to create the container; the message names the reason (a mount, a subPath, a device).',
    steps: ['Read the runtime message in Details and fix the field it names in {workload}.'],
  },
  'other.volume_mount': {
    cause:
      'A volume the pod needs cannot be attached or mounted (a missing Secret/ConfigMap volume, a detached disk, a wrong claim).',
    steps: [
      'Check the volumes of {workload}: every Secret, ConfigMap and claim it mounts must exist in the namespace.',
    ],
  },
  'other.degraded': {
    cause: 'Some replicas are not ready, without an event that says why.',
    steps: [
      'Look at the pods of {workload} on the application page: which ones are not ready and since when.',
    ],
  },
  'other.warnings': {
    cause: 'Kubernetes reported warnings for this workload that match no known pattern.',
    steps: ['Read the warning messages in Details.'],
  },
  'reliability.single_replica': {
    cause: 'With one replica every pod restart, node maintenance or rollout is an outage.',
    steps: [
      'Set replicas to 2 or more in {workload} (spec.replicas), or set its autoscaler minimum to 2.',
      'Then add a disruption budget so drains keep one replica running.',
    ],
  },
  'reliability.no_pdb': {
    cause:
      'Without a PodDisruptionBudget, voluntary disruptions (node upgrades, drains, autoscaler scale-down) may evict every replica together.',
    steps: ['Add a PodDisruptionBudget selecting the pods of {workload} with maxUnavailable: 1.'],
  },
  'reliability.pdb_blocks_eviction': {
    cause:
      'A budget that never allows a disruption (maxUnavailable 0, or minAvailable equal to the replica count) blocks node drains and cluster upgrades indefinitely.',
    steps: [
      'Change {pdb} to maxUnavailable: 1, or set minAvailable below the replica count.',
      'Or run more replicas than minAvailable.',
    ],
  },
  'reliability.no_readiness_probe': {
    cause:
      'Without a readiness probe a pod receives traffic as soon as its process starts, and keeps receiving it while it is overloaded or broken.',
    steps: [
      'Add a readinessProbe to {containers} that checks the port or path the application serves (an HTTP health path when there is one).',
    ],
  },
  'reliability.no_liveness_probe': {
    cause:
      'A liveness probe lets the kubelet restart a container that is running but stuck (deadlock, exhausted threads).',
    steps: [
      'Add a cheap livenessProbe to {containers} that checks only the process itself, not its dependencies.',
    ],
  },
  'reliability.liveness_same_as_readiness': {
    cause:
      'Readiness should remove a struggling pod from traffic; liveness should only restart a stuck process. The same check does both at once.',
    steps: [
      'Make the liveness probe of {containers} lighter than readiness (a process-only endpoint), or give it a larger failureThreshold.',
    ],
  },
  'reliability.no_startup_probe': {
    cause:
      'Liveness checks start after initialDelaySeconds; an application that takes longer to start is killed before it is ready and never comes up.',
    steps: [
      'Add a startupProbe to {containers} with failureThreshold × periodSeconds longer than the real start time; liveness then starts only after it succeeds.',
    ],
  },
  'reliability.replicas_same_node': {
    cause: 'Replicas only protect against node failures when they run on different nodes.',
    steps: [
      'Add a topologySpreadConstraint on kubernetes.io/hostname (whenUnsatisfiable: ScheduleAnyway) or a preferred pod anti-affinity to {workload}.',
    ],
  },
  'reliability.rollout_all_at_once': {
    cause: 'Replacing every pod at once turns each deployment into a short outage.',
    steps: [
      'Use strategy RollingUpdate with maxUnavailable: 0 and maxSurge: 1 (or 25%) in {workload}.',
    ],
  },
  'reliability.short_grace_period': {
    cause:
      'The grace period lets a process finish in-flight work after SIGTERM; 0–1 s kills it immediately.',
    steps: [
      'Remove terminationGracePeriodSeconds from {workload} (default 30 s) or set it to the time a clean shutdown takes.',
    ],
  },
  'reliability.revision_history_zero': {
    cause:
      'With revisionHistoryLimit 0 no previous ReplicaSet is kept, so a rollback or a paused rollout has no earlier version to return to.',
    steps: ['Remove revisionHistoryLimit from {workload} (default 10) or set it to 2 or more.'],
  },
  'reliability.deployment_paused': {
    cause:
      'A paused Deployment ignores changes to its pod template: new images and settings are not rolled out.',
    steps: [
      'Resume the rollout of {workload} (set spec.paused to false) once the change is ready.',
    ],
  },
  'reliability.liveness_single_failure': {
    cause:
      'With a liveness failureThreshold of 1, a single slow answer (a garbage-collection pause, a load burst) restarts the container.',
    steps: ['Set failureThreshold of the liveness probe of {containers} to 3 or more.'],
  },
  'reliability.probe_port_undeclared': {
    cause:
      "A named probe port is resolved from the container's declared ports; {port} is not declared by {containers}, so the {probe} probe can never succeed.",
    steps: [
      'Declare the port {port} in the ports of {containers}, or point the {probe} probe at a declared port name or number.',
    ],
  },
  'reliability.pdb_blocks_at_min_scale': {
    cause:
      'When the autoscaler {hpa} scales down to its minimum of {replicas}, the budget {pdb} (minAvailable {minAvailable}) allows no disruption and node drains hang.',
    steps: [
      'Use maxUnavailable: 1 in {pdb}, or keep minAvailable below the minimum of {hpa}.',
      'Or raise minReplicas of {hpa} above minAvailable.',
    ],
  },
  'resources.no_requests': {
    cause:
      'Requests reserve node capacity for a container; without them it gets BestEffort treatment and is the first to be evicted.',
    steps: [
      "Set {missing} requests on {containers} close to its normal usage (see the application's metrics).",
    ],
  },
  'resources.no_memory_limit': {
    cause:
      'Without a memory limit a leaking container grows until the node runs out of memory and the kernel kills something.',
    steps: ['Set a memory limit on {containers} above its peak usage.'],
  },
  'resources.limits_without_requests': {
    cause:
      'When only a limit is set, the request defaults to the limit: the container reserves its peak even when it needs far less.',
    steps: [
      'Set an explicit {resource} request on {containers} at its normal usage, keeping the limit for the peak.',
    ],
  },
  'resources.memory_near_limit': {
    cause: 'At 90% of the limit a burst, a cache warm-up or a leak kills the container.',
    steps: [
      'Raise the memory limit of {container} to about {suggested}.',
      'If usage keeps growing over days, check for a leak before raising it again.',
    ],
  },
  'resources.cpu_near_limit': {
    cause:
      'A container at its CPU limit is throttled by the kernel: latency rises without any error.',
    steps: [
      'Raise the CPU limit of {container} to about {suggested}, or remove the CPU limit and keep the request.',
      'Or scale out with an autoscaler.',
    ],
  },
  'resources.overprovisioned': {
    cause:
      'Unused requests reserve node capacity no other pod can use, which costs nodes and blocks scheduling.',
    steps: [
      "Lower the {resource} request of {container} to about {suggested} and watch the application's metrics for a week.",
    ],
  },
  'resources.underprovisioned': {
    cause:
      'Above its request a container competes for spare capacity: under node pressure it is throttled (CPU) or evicted (memory) first.',
    steps: ['Raise the {resource} request of {container} to about {suggested}.'],
  },
  'resources.oom_history': {
    cause:
      'The incident resolved, but nothing changed: the same peak will kill the container again.',
    steps: [
      "Raise the memory limit of {container} above the peak that caused the kill, or reduce the application's memory use.",
    ],
  },
  'scaling.hpa_min_equals_max': {
    cause: 'An autoscaler with equal bounds only pins the replica count.',
    steps: [
      'Raise maxReplicas of {hpa} above minReplicas, or remove the autoscaler and set replicas directly.',
    ],
  },
  'scaling.hpa_missing_requests': {
    cause:
      'Utilization is usage divided by request; without a request the autoscaler has no value to act on.',
    steps: ['Set a {resource} request on {containers} in {workload}.'],
  },
  'scaling.hpa_at_max': {
    cause:
      'The load needs more replicas than the autoscaler may create, so each replica runs hotter than its target.',
    steps: ['Raise maxReplicas of {hpa}, or make each replica handle more load.'],
  },
  'scaling.no_hpa_sustained_load': {
    cause: 'Under sustained load a fixed replica count has no headroom for peaks.',
    steps: [
      'Add a HorizontalPodAutoscaler to {workload} with a CPU utilization target around 70%, or raise its replicas.',
    ],
  },
  'scaling.hpa_inactive': {
    cause:
      'The autoscaler {hpa} cannot read the metrics it scales on ({condition}), so it keeps the current replica count whatever the load.',
    steps: [
      'Check that the metrics {hpa} scales on are served in the cluster (the resource metrics API for cpu/memory, a metrics adapter for custom or external metrics).',
      'Or change {hpa} to a metric that is available.',
    ],
  },
  'scaling.hpa_scale_down_disabled': {
    cause:
      'With scale-down disabled, every replica added under load stays until someone removes it.',
    steps: [
      'Remove behavior.scaleDown.selectPolicy: Disabled from {hpa}, or give it a slow scale-down policy instead.',
    ],
  },
  'security.privileged': {
    cause:
      "A privileged container has every capability and access to the host's devices: it is root on the node.",
    steps: [
      'Remove privileged: true from {containers}; add only the specific capabilities it needs.',
    ],
  },
  'security.privilege_escalation_allowed': {
    cause:
      'allowPrivilegeEscalation defaults to true; setting it to false blocks setuid/setgid escalation.',
    steps: ['Set securityContext.allowPrivilegeEscalation: false on {containers}.'],
  },
  'security.runs_as_root': {
    cause:
      'A process running as root inside the container is one kernel bug away from root on the node.',
    steps: [
      'Set securityContext.runAsNonRoot: true and a non-zero runAsUser on {containers}; use an image that runs as a non-root user.',
    ],
  },
  'security.writable_root_fs': {
    cause: 'A read-only root filesystem stops tampering with the image contents at run time.',
    steps: [
      'Set securityContext.readOnlyRootFilesystem: true on {containers} and mount an emptyDir where it must write (for example /tmp).',
    ],
  },
  'security.added_capabilities': {
    cause:
      'Capabilities such as SYS_ADMIN or NET_ADMIN grant near-root powers over the host kernel or network.',
    steps: [
      'Remove the capabilities {workload} does not need; keep capabilities.drop: [ALL] and add back only the exact one required.',
    ],
  },
  'security.host_namespaces': {
    cause: 'Host namespaces remove the isolation between the pod and the node.',
    steps: [
      'Remove hostNetwork/hostPID/hostIPC from {workload} unless it is a node agent that needs it; expose ports with a Service instead.',
    ],
  },
  'security.host_path': {
    cause:
      "hostPath volumes expose the node's filesystem to the pod and tie the pod to one node's contents.",
    steps: [
      'Replace the hostPath volume of {workload} with an emptyDir, a ConfigMap/Secret or a PersistentVolumeClaim.',
    ],
  },
  'security.default_service_account': {
    cause: "A dedicated service account keeps each workload's API permissions separate.",
    steps: ['Create a service account for {workload} and set serviceAccountName.'],
  },
  'security.token_automount': {
    cause:
      'Most applications never call the Kubernetes API, but every pod gets a token unless automounting is disabled.',
    steps: [
      'Set automountServiceAccountToken: false on {workload} (or on its service account) if the application does not call the Kubernetes API.',
    ],
  },
  'security.secrets_in_env': {
    cause:
      'Environment variables are copied to child processes and often printed by frameworks; mounted files are not.',
    steps: [
      'Mount the secret as a file (a secret volume) and read it from the path in {workload}.',
    ],
  },
  'security.plaintext_secret_env': {
    cause:
      'Values in the spec are stored unencrypted and shown by every tool that reads the workload.',
    steps: [
      'Move {envVars} into a Secret and reference it (valueFrom.secretKeyRef or a mounted file).',
    ],
  },
  'security.seccomp_unset': {
    cause:
      'Without a seccomp profile (or with Unconfined) every system call is allowed, including ones the container never needs.',
    steps: [
      'Set securityContext.seccompProfile.type: RuntimeDefault on {workload} (the pod level covers every container), or on {containers}.',
    ],
  },
  'security.capabilities_not_dropped': {
    cause:
      'Containers start with a default capability set (NET_RAW, CHOWN, SETUID, …) that most applications never use.',
    steps: [
      'Set securityContext.capabilities.drop: [ALL] on {containers} and add back only what it needs.',
    ],
  },
  'security.host_port': {
    cause:
      'A host port binds the pod to port {ports} of its node: it is reachable from outside the cluster network and only one such pod fits per node.',
    steps: ['Remove hostPort from {containers} and expose the port with a Service instead.'],
  },
  'security.run_as_root_group': {
    cause:
      'Group ID 0 can read and write every file owned by the root group in the image and in mounted volumes.',
    steps: ['Set a non-zero runAsGroup on {containers} (and fsGroup for volumes).'],
  },
  'security.proc_mount_unmasked': {
    cause:
      'The container runtime normally masks sensitive /proc paths; procMount: Unmasked exposes them to the container.',
    steps: [
      'Remove procMount: Unmasked from {containers} unless it runs nested containers that need it.',
    ],
  },
  'images.mutable_tag': {
    cause:
      'latest (or no tag) points to whatever was pushed last: nodes run different builds and a rollback restores nothing.',
    steps: ['Pin {image} to a version tag, or better a digest (@sha256:…).'],
  },
  'images.pull_policy_mismatch': {
    cause: 'With a moving tag and IfNotPresent, nodes cache different builds under the same name.',
    steps: [
      'Pin the image to a version or digest; or, if the tag must move, use imagePullPolicy: Always.',
    ],
  },
  'images.pull_policy_never': {
    cause:
      'With imagePullPolicy Never, a pod scheduled on a node that has not cached {image} fails with ErrImageNeverPull.',
    steps: ['Set imagePullPolicy of {containers} to IfNotPresent (pinned images) or Always.'],
  },
  'images.digest_not_pinned_production': {
    cause:
      'A tag can be pushed again: the same spec may run different code after a node pulls {image} again.',
    steps: ['Pin {image} by digest (@sha256:…) in {workload}; keep the tag for readability.'],
  },
  'config.duplicate_env': {
    cause:
      'Kubernetes keeps the last duplicate silently, so an edit to the first one has no effect.',
    steps: ['Remove the duplicate {envVars} entries from {container} in {workload}.'],
  },
  'config.subpath_no_reload': {
    cause:
      'Kubernetes refreshes mounted ConfigMaps and Secrets, except where they are mounted with subPath: changes to {volumes} never reach the running pods.',
    steps: [
      'Mount the whole {volumes} volume as a directory and read the file from it, or restart the pods after each change.',
    ],
  },
  'networking.service_selector_mismatch': {
    cause:
      'A Service routes only to pods whose labels match its selector; a typo or a relabelled workload leaves it empty.',
    steps: [
      'Compare the selector of {service} with the pod labels of the workload it should reach, and fix one of them.',
    ],
  },
  'networking.service_port_mismatch': {
    cause:
      'A Service forwards to its targetPort; a name no container declares fails, and an undeclared number usually means a typo.',
    steps: ['Set the targetPort of {service} to the container port {workload} listens on.'],
  },
  'networking.no_network_policy': {
    cause:
      'Without a NetworkPolicy every pod can reach every other pod; a policy limits who can connect.',
    steps: [
      'Add a NetworkPolicy for {workload} that allows only the callers it needs (for example its ingress and the pods of its own application).',
    ],
  },
  'networking.network_policy_allows_all': {
    cause:
      'Network policies add up: one ingress rule without sources or ports admits every pod and every address, whatever the other rules say.',
    steps: [
      'Give that rule of {policy} a from list (the namespaces or pods that may connect), or remove it.',
    ],
  },
  'change_risk.high_velocity': {
    cause:
      'A high change rate raises the chance that one change breaks the application and makes causes harder to find.',
    steps: [
      'Group changes into fewer releases, and protect the application with a protection plan so risky changes are caught before they apply.',
    ],
  },
  'change_risk.frequent_rollbacks': {
    cause: 'Repeated rollbacks mean faulty versions are reaching the cluster.',
    steps: [
      'Test versions before they reach this environment, and add a protection plan in enforce mode for the checks the rollbacks were about.',
    ],
  },
  'protection.production_uncovered': {
    cause:
      'Protection plans check changes before they apply; a production application without one is changed unchecked.',
    steps: [
      'Create a protection plan covering {app} (Protection plans page), start in audit mode, then switch to enforce.',
    ],
  },
  'protection.production_audit_only': {
    cause: 'Audit mode records violations without stopping them; production usually needs enforce.',
    steps: [
      'Review the violations of {plans}; once they are clean, switch the plan to enforce mode.',
    ],
  },
  'consistency.image_skew': {
    cause:
      'Instances of the same application that run different builds behave differently and hide bugs.',
    steps: [
      'If the difference is not a deliberate staged rollout, align the image of {workload} across {namespaces}.',
    ],
  },
};

export const PROBE_FAILURE_CAUSE: Record<string, string> = {
  refused:
    'Nothing listens on the probed port: the application is not started yet, crashed, or listens on another port.',
  http_status:
    'The application answers, but with an error status on the probed path (a wrong path, or the application reports itself unhealthy).',
  timeout:
    'The application did not answer within timeoutSeconds: it is overloaded, blocked, or the timeout is too short.',
  command: 'The check command ran inside the container and returned a failure.',
  other: 'The probe failed; the message states why.',
};

export const CHANGE_ROLLBACK_STEP =
  'This began after change gen {generation}. If the change caused it, roll back to the snapshot taken before it from the Snapshots section (Manage Snapshots).';

export const RESOLVES_ON_ITS_OWN =
  'This incident resolves on its own once the workload is healthy again.';

const DETAILS_STEP = 'Read the details below: they state what was observed.';

// A reason this bundle does not know yet (newer analyzer) falls back per kind.
export const KIND_FALLBACK_GUIDANCE: Record<InsightKind, InsightGuidance> = {
  crashloop: {
    cause: 'A container keeps exiting and the kubelet keeps restarting it.',
    steps: ['Read the container logs from the last restart.', DETAILS_STEP],
  },
  oom: {
    cause: 'A container used more memory than it may, so the kernel killed it.',
    steps: ['Compare the memory usage of {workload} with its memory limit.', DETAILS_STEP],
  },
  image_pull: {
    cause: 'The node cannot pull the image of {workload}.',
    steps: [
      'Check the image name, the registry reachability and the pull credentials.',
      DETAILS_STEP,
    ],
  },
  probe_failure: {
    cause: 'A health check of {workload} keeps failing.',
    steps: ['Check the probes of {workload} against what the application serves.', DETAILS_STEP],
  },
  scheduling: {
    cause: 'The scheduler found no node for the pods of {workload}.',
    steps: [
      'Adjust the requests, node rules or capacity the scheduler message names.',
      DETAILS_STEP,
    ],
  },
  rollout_stuck: {
    cause: 'The rollout of {workload} is not progressing.',
    steps: ['Look at the new pods of {workload}: why are they not ready?', DETAILS_STEP],
  },
  config_change_regression: {
    cause: '{workload} degraded shortly after a change.',
    steps: [
      'Review the change in History Changes and roll back if it caused the problem.',
      DETAILS_STEP,
    ],
  },
  resource_pressure: {
    cause: 'The node ran short of a resource and evicted pods of {workload}.',
    steps: ['Set requests close to the real usage of {workload}.', DETAILS_STEP],
  },
  other: {
    cause: 'Kubernetes reported a problem with {workload}.',
    steps: [DETAILS_STEP],
  },
  reliability: {
    cause: 'The setup of {workload} leaves it exposed to restarts, drains or rollouts.',
    steps: [DETAILS_STEP],
  },
  resources: {
    cause: 'The requests or limits of {workload} do not match what it needs.',
    steps: [DETAILS_STEP],
  },
  scaling: { cause: 'The autoscaling of {workload} is misconfigured.', steps: [DETAILS_STEP] },
  security: {
    cause: 'The security settings of {workload} are weaker than needed.',
    steps: [DETAILS_STEP],
  },
  images: {
    cause: 'The image settings of {workload} make its version unpredictable.',
    steps: [DETAILS_STEP],
  },
  config: { cause: 'The configuration of {workload} has a gap.', steps: [DETAILS_STEP] },
  networking: { cause: 'The network setup of {workload} has a gap.', steps: [DETAILS_STEP] },
  change_risk: {
    cause: 'The change history of this application carries risk.',
    steps: [DETAILS_STEP],
  },
  protection: {
    cause: 'Changes to this application are not checked before they apply.',
    steps: [DETAILS_STEP],
  },
  consistency: { cause: 'The same workload differs between namespaces.', steps: [DETAILS_STEP] },
};

export const GENERIC_GUIDANCE: InsightGuidance = { cause: '', steps: [DETAILS_STEP] };
