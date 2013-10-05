require 'spec_helper'

describe "volumes/show" do
  before(:each) do
    @volume = assign(:volume, stub_model(Volume))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
