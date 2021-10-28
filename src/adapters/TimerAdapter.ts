const TimerAdapter = {
  setTimeOut: (monitoredServiceId: string, min: number): Promise<void> =>
    new Promise(resolve => resolve())
}

export default TimerAdapter;