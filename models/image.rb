require "paperclip/rack"

class Image < ActiveRecord::Base
	include Paperclip::Glue

  has_many :tagged_items
  has_many :tags, :through => :tagged_items

  has_attached_file :file, :styles => { :thumb => "150x150#", :gallery => "800x600" }
  validates_attachment_content_type :file, :content_type => ["image/jpg", "image/jpeg", "image/png", "image/gif"]

  def set_tags(tag_names)
    self.tags = []
    tag_names.each do |t|
      tags << Tag.where(:name => t.strip.singularize.capitalize).first_or_create
    end

    self.save!
  end
end
