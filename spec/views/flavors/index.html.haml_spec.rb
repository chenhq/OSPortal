require 'spec_helper'

describe "flavors/index" do
  before(:each) do
    assign(:flavors, [
      stub_model(Flavor),
      stub_model(Flavor)
    ])
  end

  it "renders a list of flavors" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
  end
end
