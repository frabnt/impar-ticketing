/**
 * Created by francesco on 14/12/2016.
 */

export class MockSpinnerService {

  constructor() { }

  create(content: string, spinner: string = 'crescent') {
    //create the spinner
  }

  createAndShow(spinner: string, content: string = 'crescent') {
    // create and show the spinner
  }

  setContent(content: string) {
    //set spinner content
  }

  getContent(): string {
    return 'test-string';
  }

  concatContent(newContent: string) {
    //concatenate spinner content with the given string
  }

  present() {
    //show the spinner in the ui
  }

  dismiss() {
    //dismiss the spinner
  }
}
