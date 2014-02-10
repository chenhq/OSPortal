require 'spec_helper'

describe "flavors/show" do
  before(:each) do
    @flavor = assign(:flavor, stub_model(Flavor,
      :alias => "Alias",
      :name => "Name",
      :vcpus => 1,
      :memory_mb => 2,
      :flavorid => "Flavorid"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Alias/)
    rendered.should match(/Name/)
    rendered.should match(/1/)
    rendered.should match(/2/)
    rendered.should match(/Flavorid/)
  end
end
