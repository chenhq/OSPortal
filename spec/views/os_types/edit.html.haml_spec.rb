require 'spec_helper'

describe "os_types/edit" do
  before(:each) do
    @os_type = assign(:os_type, stub_model(OsType,
      :name => "MyString",
      :family => "MyString",
      :desc => "MyString"
    ))
  end

  it "renders the edit os_type form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form[action=?][method=?]", os_type_path(@os_type), "post" do
      assert_select "input#os_type_name[name=?]", "os_type[name]"
      assert_select "input#os_type_family[name=?]", "os_type[family]"
      assert_select "input#os_type_desc[name=?]", "os_type[desc]"
    end
  end
end
