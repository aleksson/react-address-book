const assert = require('assert'),
	should = require('chai').should(),
  expect = require('chai').expect;
  
const mocha = { modules: [ 'chai', 'mocha' ] };

	
describe('Aleks Tests', function() {
  
  describe('1. Start Mocha & Chai', function() {
    it('OK', function() {
      expect(assert).to.be.a('function');
    });
  });  

  describe('2.Loaded Mocha & Chai', function() {
    it('OK', function() {
      expect(mocha).to.have.property('modules').with.lengthOf(2);
    });
  });
  
});
