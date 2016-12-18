import { TestBed } from "@angular/core/testing";
import { LoadingController } from "ionic-angular";
import { MockLoadingController, MockLoading } from "../../mocks";
import { SpinnerService } from "./spinner-service";
/**
 * Created by francesco on 17/12/2016.
 */

describe('Services: Spinner-service', () => {

  let spinnerService: SpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SpinnerService,
        { provide: LoadingController, useClass: MockLoadingController }
      ]
    });
    spinnerService = TestBed.get(SpinnerService);
  });

  it('should create the spinner', () => {
    spyOn(MockLoadingController.prototype, 'create');
    spinnerService.create('content');

    expect(MockLoadingController.prototype.create).toHaveBeenCalledTimes(1);
    expect(MockLoadingController.prototype.create)
      .toHaveBeenCalledWith({spinner: 'crescent', content: 'content'});
    expect(spinnerService.getContent()).toBe('content');
  });

  it('should create and show the spinner', () => {
    spyOn(spinnerService, 'create');
    spyOn(spinnerService, 'present');
    spinnerService.createAndShow('content');

    expect(spinnerService.create).toHaveBeenCalledTimes(1);
    expect(spinnerService.create)
      .toHaveBeenCalledWith('content', 'crescent');
    expect(spinnerService.present).toHaveBeenCalledTimes(1);
  });

  describe('should manipulate the spinner content', () => {
    beforeEach(() => {
      spyOn(MockLoading.prototype, 'setContent');
      spinnerService.create('test-content');
    });

    it('should retrieve the spinner content', () => {
      expect(spinnerService.getContent()).toBe('test-content');
    });

    it('should set the spinner content', () => {
      spinnerService.setContent('new-content');

      expect(spinnerService.getContent()).toBe('new-content');
      expect(MockLoading.prototype.setContent).toHaveBeenCalledTimes(1);
      expect(MockLoading.prototype.setContent).toHaveBeenCalledWith('new-content');
    });

    it('should concat the current spinner content with the new content', () => {
      spinnerService.concatContent('-concatenated');

      expect(MockLoading.prototype.setContent).toHaveBeenCalledTimes(1);
      expect(MockLoading.prototype.setContent).toHaveBeenCalledWith('test-content-concatenated');
    });
  });

  describe('should present the spinner', () => {
    beforeEach(() => {
      spyOn(MockLoading.prototype, 'present');
    });

    it('should present the spinner if it has already been created', () => {
      spinnerService.create('content');
      spinnerService.present();

      expect(MockLoading.prototype.present).toHaveBeenCalledTimes(1);
    });

    it('should not present the spinner if it has not been created', () => {
      spinnerService.present();
      expect(MockLoading.prototype.present).not.toHaveBeenCalled();
    });
  });

  describe('should dismiss the spinner', () => {
    beforeEach(() => {
      spyOn(MockLoading.prototype, 'dismiss');
    });

    it('should dismiss the spinner if it has already been created', () => {
      spinnerService.create('content');
      spinnerService.dismiss();

      expect(MockLoading.prototype.dismiss).toHaveBeenCalledTimes(1);
    });

    it('should not dismiss the spinner if it has not been created', () => {
      spinnerService.dismiss();
      expect(MockLoading.prototype.dismiss).not.toHaveBeenCalled();
    });
  });

});
