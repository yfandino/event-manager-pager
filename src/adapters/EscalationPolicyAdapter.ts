import { EscalationPolicy } from "../types";

type Input = {
  [key: string]: EscalationPolicy
}

const EscalationPolicyAdapter = (persistence: Input = {}) => ({
  getEscalationPolicy(monitoredServiceId: string): Promise<EscalationPolicy> {
    return new Promise(resolve => resolve(persistence[monitoredServiceId]));
  }
});

export default EscalationPolicyAdapter;