require 'spec_helper'

describe "operating_systems/show" do
  before(:each) do
    @operating_system = assign(:operating_system, stub_model(OperatingSystem,
      :name => "Name",
      :os_type_id => 1,
      :cpuarc => "Cpuarc",
      :cpubit => 2,
      :desc => "Desc"
    ))
  end

  it "renders attributes in <p>" do
    render
    # Run the generator again with the --webrat flag if you want to use webrat matchers
    rendered.should match(/Name/)
    rendered.should match(/1/)
    rendered.should match(/Cpuarc/)
    rendered.should match(/2/)
    rendered.should match(/Desc/)
  end
end
