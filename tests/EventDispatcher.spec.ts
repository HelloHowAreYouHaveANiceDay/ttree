import EventDispatcher from '../src/ttree/tEventDispatcher';

describe('event dispatcher', () => {
  const logger = (e) => console.log(e);
  const fogger = (e) => console.log(e);
  const slogger = (e) => console.log(e);
  const plogger = (e) => console.log(e);
  const event1 = {
    type: 'event1',
    listener: logger
  }
  const event1a = {
    type: 'event1',
    listener: fogger
  }
  const event2 = {
    type: 'event2',
    listener: slogger
  }
  const event2a = {
    type: 'event2',
    listener: plogger
  }

  test('addEvent', () => {
    const ED = new EventDispatcher();
    ED.addEventListener(event1.type, event1.listener);
    const has1 = ED.hasEventListener(event1.type, event1.listener);
    const not1 = ED.hasEventListener(event1a.type, event1a.listener);
    expect(has1).toEqual(true);
    expect(not1).toEqual(false);
  })

  test('removeEvent', () => {
    const ED = new EventDispatcher();
    ED.addEventListener(event1.type, event1.listener);
    const has1 = ED.hasEventListener(event1.type, event1.listener);
    expect(has1).toEqual(true);
    ED.removeEventListener(event1.type, event1.listener);
    const has1now = ED.hasEventListener(event1.type, event1.listener);
    expect(has1now).toEqual(false);
  });


  
})